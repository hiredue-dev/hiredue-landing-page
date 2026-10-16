import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth/services/apiClient.js", () => ({ apiClient: { post: vi.fn() } }));

import { apiClient } from "@/features/auth/services/apiClient.js";
import { STRONG, STRONG_RESUME } from "../__fixtures__/resumes.js";
import { AtsError } from "../errors.js";
import { forgetStructure, generateJson, MAX_RESUME_CHARS, optimizeResume, structureResume, tailorResume } from "./atsService.js";

const ok = (content) => ({ status: 200, ok: true, success: true, data: { content, provider: "openai" }, error: null });
const fail = (status) => ({ status, ok: false, success: false, data: null, error: "nope" });
const promptOf = (call) => call[1].prompt;

const JOB = {
  title: "Senior Frontend Engineer",
  company: "Acme",
  description: "We need React, TypeScript, Kubernetes and Storybook experience to build our design system and ship accessible UI.",
};

const isStructure = (prompt) => prompt.startsWith("TASK: structure");

beforeEach(() => {
  apiClient.post.mockReset();
  forgetStructure();
});

describe("generateJson", () => {
  it("posts a JSON prompt to llm/generate with the user's token", async () => {
    apiClient.post.mockResolvedValue(ok({ ops: [] }));
    await expect(generateJson("PROMPT")).resolves.toEqual({ ops: [] });
    expect(apiClient.post).toHaveBeenCalledWith("llm/generate", { provider: "openai", prompt: "PROMPT", responseFormat: "json" });
  });

  it.each([
    [401, "auth"],
    [413, "too_long"],
    [429, "rate_limited"],
    [502, "unavailable"],
    [503, "unavailable"],
    [500, "failed"],
  ])("maps HTTP %i to %s", async (status, code) => {
    apiClient.post.mockResolvedValue(fail(status));
    await expect(generateJson("P")).rejects.toMatchObject({ name: "AtsError", code });
  });

  it("gives up after the timeout", async () => {
    vi.useFakeTimers();
    try {
      apiClient.post.mockReturnValue(new Promise(() => {}));
      const pending = generateJson("P", { timeoutMs: 1000 });
      const settled = expect(pending).rejects.toMatchObject({ code: "timeout", retry: true });
      await vi.advanceTimersByTimeAsync(1001);
      await settled;
    } finally {
      vi.useRealTimers();
    }
  });

  it("treats a network failure as the service being unavailable", async () => {
    apiClient.post.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(generateJson("P")).rejects.toMatchObject({ code: "unavailable" });
  });
});

describe("structureResume", () => {
  it("asks once per resume and keeps the answer", async () => {
    apiClient.post.mockResolvedValue(ok(STRONG_RESUME));
    await expect(structureResume(STRONG)).resolves.toEqual(STRONG_RESUME);
    await structureResume(STRONG);
    expect(apiClient.post).toHaveBeenCalledTimes(1);
  });

  it("asks once more when the answer drops content, then gives up", async () => {
    apiClient.post.mockResolvedValueOnce(ok({ ...STRONG_RESUME, experience: [] })).mockResolvedValueOnce(ok(STRONG_RESUME));
    await expect(structureResume(STRONG)).resolves.toEqual(STRONG_RESUME);
    forgetStructure();
    apiClient.post.mockReset().mockResolvedValue(ok({ name: "Priya Sharma" }));
    await expect(structureResume(STRONG)).rejects.toMatchObject({ code: "unstructured", retry: true });
    expect(apiClient.post).toHaveBeenCalledTimes(2);
  });

  it("doesn't keep a failure", async () => {
    apiClient.post.mockResolvedValueOnce(fail(502)).mockResolvedValueOnce(ok(STRONG_RESUME));
    await expect(structureResume(STRONG)).rejects.toMatchObject({ code: "unavailable" });
    await expect(structureResume(STRONG)).resolves.toEqual(STRONG_RESUME);
  });
});

describe("optimizeResume", () => {
  const edits = (ops) => (_path, body) => Promise.resolve(isStructure(body.prompt) ? ok(STRONG_RESUME) : ok({ ops }));

  it("applies the model's verified edits and rescores", async () => {
    apiClient.post.mockImplementation(
      edits([
        {
          op: "rewrite",
          id: "experience.0.2",
          after: "Mentored 5 engineers in GraphQL and testing practices through code reviews and pairing sessions.",
          reason: "clearer",
        },
        { op: "rewrite", id: "contact.email", after: "Invented." },
      ]),
    );
    const stages = [];
    const result = await optimizeResume(STRONG, { onStage: (s) => stages.push(s) });
    expect(stages).toEqual(["structuring", "rewriting", "rescoring"]);
    expect(result.changes).toHaveLength(1);
    expect(result.refused).toHaveLength(1);
    expect(result.resume.experience[0].bullets[2]).toContain("pairing sessions.");
    expect(result.text).toContain("• Mentored 5 engineers in GraphQL and testing practices through code reviews and pairing sessions.");
    // Both sides of the diff come from the structure, so only the edit differs.
    expect(result.original.split("\n").filter((line) => !result.text.split("\n").includes(line))).toHaveLength(1);
    expect(result.score.before.overall).toEqual(expect.any(Number));
    expect(result.score.after.overall).toEqual(expect.any(Number));
    // The checker's own findings, and the line ids, guide the prompt.
    const prompt = promptOf(apiClient.post.mock.calls[1]);
    expect(prompt).toContain("WHAT AN AUTOMATED CHECK FLAGGED");
    expect(prompt).toContain('"id":"experience.0.2"');
  });

  it("reports when nothing safe could be changed", async () => {
    apiClient.post.mockImplementation(edits([]));
    await expect(optimizeResume(STRONG)).rejects.toMatchObject({ code: "no_changes" });
  });

  it("stops when the resume can't be structured", async () => {
    apiClient.post.mockResolvedValue(ok({}));
    await expect(optimizeResume(STRONG)).rejects.toMatchObject({ code: "unstructured" });
  });

  it("refuses an oversized resume before calling out", async () => {
    await expect(optimizeResume("x".repeat(MAX_RESUME_CHARS + 1))).rejects.toBeInstanceOf(AtsError);
    expect(apiClient.post).not.toHaveBeenCalled();
  });
});

describe("tailorResume", () => {
  const answer = (prompt) => {
    if (isStructure(prompt)) return ok(STRONG_RESUME);
    if (prompt.startsWith("TASK: gap analysis")) {
      return ok({ keywords: [{ term: "React", importance: "required" }, { term: "Kubernetes", importance: "required" }, { term: "Storybook", importance: "preferred" }] });
    }
    if (prompt.startsWith("TASK: missed keywords")) return ok({ keywords: [] });
    if (prompt.startsWith("TASK: skills section")) {
      return ok({ ops: [{ op: "add_skill", skill: "Kubernetes" }, { op: "add_skill", skill: "Storybook" }] });
    }
    if (prompt.startsWith("TASK: resume bullets")) {
      return ok({
        ops: [
          {
            op: "rewrite",
            id: "experience.0.1",
            after: "Built a shared React component library and design system adopted by 12 product teams, reducing UI bugs by 30%.",
          },
        ],
      });
    }
    return fail(500);
  };

  it("analyses the job, tailors, and reports the match before and after", async () => {
    apiClient.post.mockImplementation((_path, body) => Promise.resolve(answer(body.prompt)));
    const stages = [];
    const result = await tailorResume(STRONG, JOB, { onStage: (s) => stages.push(s) });

    expect(stages).toEqual(["analyzing", "rewriting", "rescoring"]);
    expect(result.match.before).toMatchObject({ covered: 1, total: 3 });
    expect(result.match.after).toMatchObject({ covered: 3, total: 3, percent: 100 });
    expect(result.changes.map((c) => c.kind)).toEqual(["reworded", "added", "added"]);
    expect(result.partial).toBe(false);
    expect(result.resume.skills[0].items.slice(-2)).toEqual(["Kubernetes", "Storybook"]);
    // The job goes to the model as data.
    const analysis = apiClient.post.mock.calls.map(promptOf).find((p) => p.startsWith("TASK: gap analysis"));
    expect(analysis).toContain(JSON.stringify(JOB));
  });

  it("still tailors when one of the two rewrite calls fails", async () => {
    apiClient.post.mockImplementation((_path, body) =>
      Promise.resolve(body.prompt.startsWith("TASK: skills section") ? fail(502) : answer(body.prompt)),
    );
    const result = await tailorResume(STRONG, JOB);
    expect(result.partial).toBe(true);
    expect(result.changes.map((c) => c.kind)).toEqual(["reworded"]);
  });

  it("surfaces a rate limit from the first call", async () => {
    apiClient.post.mockResolvedValue(fail(429));
    await expect(tailorResume(STRONG, JOB)).rejects.toMatchObject({ code: "rate_limited", retry: true });
  });
});
