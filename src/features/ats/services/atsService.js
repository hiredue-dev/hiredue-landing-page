import { apiClient } from "@/features/auth/services/apiClient.js";
import { coverage } from "../coverage.js";
import { AtsError } from "../errors.js";
import { applyOps } from "../patch.js";
import { analysisPrompt, bulletsPrompt, missedKeywordsPrompt, optimizePrompt, skillsPrompt } from "../prompts.js";
import { scoreResume } from "../scoring.js";

/*
 * Optimising and tailoring call the backend's LLM endpoint (POST llm/generate,
 * the same one the desktop app falls back to). It needs a signed-in user and
 * allows 30 calls a minute each. Scoring never calls out: see scoring.js.
 */

export const LLM_TIMEOUT_MS = 90_000;
export const MAX_RESUME_CHARS = 30_000;
export const MAX_JOB_CHARS = 15_000;
// The desktop asks the gap analysis again for what it missed; one follow-up
// is enough on the web, where every call is a visitor waiting.
const MAX_ANALYSIS_ROUNDS = 2;
const MIN_NEW_KEYWORDS = 2;
const MAX_KEYWORDS = 40;

const STATUS_ERRORS = { 401: "auth", 413: "too_long", 429: "rate_limited", 502: "unavailable", 503: "unavailable", 504: "timeout" };

function withTimeout(promise, ms) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      timer = setTimeout(() => reject(new AtsError("timeout")), ms);
    }),
  ]).finally(() => clearTimeout(timer));
}

/** One JSON prompt → the model's parsed JSON, or an AtsError. */
export async function generateJson(prompt, { timeoutMs = LLM_TIMEOUT_MS } = {}) {
  let response;
  try {
    response = await withTimeout(
      apiClient.post("llm/generate", { provider: "openai", prompt, responseFormat: "json" }),
      timeoutMs,
    );
  } catch (err) {
    if (err instanceof AtsError) throw err;
    throw new AtsError("unavailable", { cause: err });
  }
  if (!response.success) throw new AtsError(STATUS_ERRORS[response.status] ?? "failed");
  const content = response.data?.content;
  if (!content || typeof content !== "object") throw new AtsError("failed");
  return content;
}

function checkLength(text, job) {
  if (text.length > MAX_RESUME_CHARS) throw new AtsError("too_long");
  if (job && job.description.length > MAX_JOB_CHARS) throw new AtsError("too_long");
}

const opsOf = (answer) => (Array.isArray(answer?.ops) ? answer.ops : []);

/**
 * Improve the whole resume, then score it again.
 * @param {string} text
 * @param {{onStage?: (stage: string) => void}} [options]
 */
export async function optimizeResume(text, { onStage } = {}) {
  checkLength(text);
  const before = scoreResume(text);
  onStage?.("rewriting");
  const answer = await generateJson(optimizePrompt(text, before.issues));
  onStage?.("rescoring");
  const patch = applyOps(text, opsOf(answer));
  if (!patch.changes.length) throw new AtsError("no_changes");
  return {
    original: text,
    text: patch.text,
    changes: patch.changes,
    refused: patch.refused,
    score: { before, after: scoreResume(patch.text) },
  };
}

/**
 * The job's keywords: a gap analysis, asked once more for what it missed.
 * @returns {Promise<{term: string, importance: string, evidence?: string|null}[]>}
 */
export async function analyzeJob(text, job) {
  const keywords = [];
  const seen = new Set();
  const add = (list) => {
    let fresh = 0;
    for (const k of Array.isArray(list) ? list : []) {
      const term = String(k?.term ?? "").trim();
      if (!term || seen.has(term.toLowerCase()) || keywords.length >= MAX_KEYWORDS) continue;
      seen.add(term.toLowerCase());
      keywords.push({ term, importance: k.importance === "preferred" ? "preferred" : "required", evidence: k.evidence ?? null });
      fresh += 1;
    }
    return fresh;
  };
  add((await generateJson(analysisPrompt(text, job))).keywords);
  for (let round = 1; round < MAX_ANALYSIS_ROUNDS; round += 1) {
    let fresh = 0;
    try {
      fresh = add((await generateJson(missedKeywordsPrompt(job, keywords.map((k) => k.term)))).keywords);
    } catch {
      break; // the first pass is enough to tailor with
    }
    if (fresh < MIN_NEW_KEYWORDS) break;
  }
  return keywords;
}

/**
 * Tailor the resume to one job, then score it and its job match again.
 * @param {string} text
 * @param {{title: string, company: string, description: string}} job
 * @param {{onStage?: (stage: string) => void}} [options]
 */
export async function tailorResume(text, job, { onStage } = {}) {
  const target = { title: job.title.trim(), company: job.company.trim(), description: job.description.trim() };
  checkLength(text, target);
  const jobText = [target.title, target.company, target.description].join("\n");

  onStage?.("analyzing");
  const keywords = await analyzeJob(text, target);
  if (!keywords.length) throw new AtsError("failed");
  const terms = keywords.map((k) => k.term);
  const matchBefore = coverage(terms, text);

  onStage?.("rewriting");
  const analysis = keywords.map((k, i) => ({ ...k, onResume: matchBefore.keywords[i]?.covered ?? false }));
  // Skills and bullets are separate asks, in parallel; one failing still leaves the other.
  const [skills, bullets] = await Promise.allSettled([
    generateJson(skillsPrompt(text, target, analysis)),
    generateJson(bulletsPrompt(text, target, analysis)),
  ]);
  if (skills.status === "rejected" && bullets.status === "rejected") throw bullets.reason;
  const ops = [
    ...(bullets.status === "fulfilled" ? opsOf(bullets.value) : []),
    ...(skills.status === "fulfilled" ? opsOf(skills.value) : []),
  ];

  onStage?.("rescoring");
  const patch = applyOps(text, ops, { jobText });
  if (!patch.changes.length) throw new AtsError("no_changes");
  return {
    original: text,
    text: patch.text,
    changes: patch.changes,
    refused: patch.refused,
    keywords,
    partial: skills.status === "rejected" || bullets.status === "rejected",
    match: { before: matchBefore, after: coverage(terms, patch.text) },
    score: { before: scoreResume(text), after: scoreResume(patch.text) },
  };
}
