import { apiClient } from "@/features/auth/services/apiClient.js";
import { coverage } from "../coverage.js";
import { AtsError } from "../errors.js";
import { applyOps } from "../patch.js";
import { analysisPrompt, bulletsPrompt, missedKeywordsPrompt, optimizePrompt, skillsPrompt, structurePrompt } from "../prompts.js";
import { scoreResume } from "../scoring.js";
import { resumeToText, toResume } from "../structure.js";

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

// A model answer that fails structure.js's checks is asked for once more.
const STRUCTURE_ATTEMPTS = 2;
let structured = { text: null, promise: null };

/**
 * The resume's text sorted into the fixed structure (structure.js), checked
 * against the text. Kept for the last resume, so Optimize then Tailor asks once.
 * @returns {Promise<object>}
 */
export function structureResume(text) {
  if (structured.text === text && structured.promise) return structured.promise;
  const promise = (async () => {
    for (let attempt = 1; ; attempt += 1) {
      const answer = await generateJson(structurePrompt(text));
      try {
        return toResume(answer, text);
      } catch (err) {
        if (attempt >= STRUCTURE_ATTEMPTS || err?.code !== "unstructured") throw err;
      }
    }
  })();
  structured = { text, promise };
  promise.catch(() => {
    if (structured.promise === promise) structured = { text: null, promise: null };
  });
  return promise;
}

/** Drops the kept structure (tests, or a resume that changed). */
export function forgetStructure() {
  structured = { text: null, promise: null };
}

/**
 * Applies the model's edits, then drops any that lower the ATS score: each
 * accepted edit is left out in turn, and stays out when the resume scores
 * higher without it. Scoring is local and deterministic, so this is cheap.
 * With a `floor`, it stops once the score reaches it (tailoring keeps keyword
 * edits that cost a point, as long as the resume doesn't end up below where it began).
 * @returns {ReturnType<typeof applyOps> & {dropped: object[]}}
 */
export function applyGains(resume, ops, { floor = Infinity, ...context } = {}) {
  const first = applyOps(resume, ops, context);
  let kept = first.applied;
  let patch = first;
  let best = scoreResume(resumeToText(patch.resume)).overall;
  const dropped = [];
  for (const op of first.applied) {
    if (best >= floor) break;
    const without = kept.filter((o) => o !== op);
    const trial = applyOps(resume, without, context);
    const score = scoreResume(resumeToText(trial.resume)).overall;
    if (score > best) {
      kept = without;
      patch = trial;
      best = score;
      dropped.push(op);
    }
  }
  return { ...patch, refused: first.refused, dropped };
}

// What both flows return: the resume before and after as structure and as
// text. Both texts come from the structure, so the diff shows only the edits.
// `unchanged` means the edits wouldn't raise the score: the visitor is shown
// their original resume instead, and `resume`/`text` are the original's.
function outcome(text, resume, patch, { unchanged = false } = {}) {
  const original = resumeToText(resume);
  const before = scoreResume(text);
  if (unchanged) {
    return { unchanged: true, original, text: original, resume, changes: [], refused: patch.refused, dropped: patch.dropped, score: { before, after: before } };
  }
  const after = resumeToText(patch.resume);
  return {
    unchanged: false,
    original,
    text: after,
    resume: patch.resume,
    changes: patch.changes,
    refused: patch.refused,
    dropped: patch.dropped,
    score: { before, after: scoreResume(after) },
  };
}

/**
 * Improve the whole resume, then score it again.
 * @param {string} text
 * @param {{onStage?: (stage: string) => void}} [options]
 */
export async function optimizeResume(text, { onStage } = {}) {
  checkLength(text);
  onStage?.("structuring");
  const resume = await structureResume(text);
  onStage?.("rewriting");
  const answer = await generateJson(optimizePrompt(resume, scoreResume(text).issues));
  onStage?.("rescoring");
  const patch = applyGains(resume, opsOf(answer));
  // An already strong resume can come back no better, or worse: keep the original.
  const gained = patch.changes.length > 0 && scoreResume(resumeToText(patch.resume)).overall > scoreResume(text).overall;
  return outcome(text, resume, patch, { unchanged: !gained });
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
  const [resume, keywords] = await Promise.all([structureResume(text), analyzeJob(text, target)]);
  if (!keywords.length) throw new AtsError("failed");
  const terms = keywords.map((k) => k.term);
  const matchBefore = coverage(terms, text);

  onStage?.("rewriting");
  const analysis = keywords.map((k, i) => ({ ...k, onResume: matchBefore.keywords[i]?.covered ?? false }));
  // Skills and bullets are separate asks, in parallel; one failing still leaves the other.
  const [skills, bullets] = await Promise.allSettled([
    generateJson(skillsPrompt(resume, target, analysis)),
    generateJson(bulletsPrompt(resume, target, analysis)),
  ]);
  if (skills.status === "rejected" && bullets.status === "rejected") throw bullets.reason;
  const ops = [
    ...(bullets.status === "fulfilled" ? opsOf(bullets.value) : []),
    ...(skills.status === "fulfilled" ? opsOf(skills.value) : []),
  ];

  onStage?.("rescoring");
  // Tailoring must not cost ATS score, and must raise the match or the score;
  // otherwise the original is the better resume to send.
  const scoreBefore = scoreResume(text).overall;
  const patch = applyGains(resume, ops, { jobText, floor: scoreBefore });
  const scoreAfter = scoreResume(resumeToText(patch.resume)).overall;
  const matchAfter = coverage(terms, resumeToText(patch.resume));
  const gained = patch.changes.length > 0 && scoreAfter >= scoreBefore && (matchAfter.percent > matchBefore.percent || scoreAfter > scoreBefore);
  const result = outcome(text, resume, patch, { unchanged: !gained });
  return {
    ...result,
    keywords,
    partial: skills.status === "rejected" || bullets.status === "rejected",
    match: { before: matchBefore, after: gained ? matchAfter : matchBefore },
  };
}
