import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/features/auth/services/apiClient.js", () => ({ apiClient: { post: vi.fn() } }));

import { apiClient } from "@/features/auth/services/apiClient.js";
import { STRONG } from "../__fixtures__/resumes.js";
import { AtsError } from "../errors.js";
import { generateJson, MAX_RESUME_CHARS, optimizeResume, tailorResume } from "./atsService.js";

const ok = (content) => ({ status: 200, ok: true, success: true, data: { content, provider: "openai" }, error: null });
const fail = (status) => ({ status, ok: false, success: false, data: null, error: "nope" });
const promptOf = (call) => call[1].prompt;

const JOB = {
  title: "Senior Frontend Engineer",
  company: "Acme",
  description: "We need React, TypeScript, Kubernetes and Storybook experience to build our design system and ship accessible UI.",
};

beforeEach(() => {
  apiClient.post.mockReset();
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

describe("optimizeResume", () => {
  it("applies the model's verified edits and rescores", async () => {
    apiClient.post.mockResolvedValue(
      ok({
        ops: [
          {
            op: "rewrite_line",
            before: "Mentored 5 engineers through code reviews and pairing on GraphQL and testing practices.",
            after: "Mentored 5 engineers in GraphQL and testing practices through code reviews and pairing sessions.",
            reason: "clearer",
          },
          { op: "rewrite_line", before: "Not on the resume.", after: "Invented." },
        ],
      }),
    );
    const stages = [];
    const result = await optimizeResume(STRONG, { onStage: (s) => stages.push(s) });
    expect(stages).toEqual(["rewriting", "rescoring"]);
    expect(result.changes).toHaveLength(1);
    expect(result.refused).toHaveLength(1);
    expect(result.text).toContain("pairing sessions.");
    expect(result.score.before.overall).toEqual(expect.any(Number));
    expect(result.score.after.overall).toEqual(expect.any(Number));
    // The checker's own findings guide the prompt.
    expect(promptOf(apiClient.post.mock.calls[0])).toContain("WHAT AN AUTOMATED CHECK FLAGGED");
  });

  it("reports when nothing safe could be changed", async () => {
    apiClient.post.mockResolvedValue(ok({ ops: [] }));
    await expect(optimizeResume(STRONG)).rejects.toMatchObject({ code: "no_changes" });
  });

  it("refuses an oversized resume before calling out", async () => {
    await expect(optimizeResume("x".repeat(MAX_RESUME_CHARS + 1))).rejects.toBeInstanceOf(AtsError);
    expect(apiClient.post).not.toHaveBeenCalled();
  });
});

describe("tailorResume", () => {
  const answer = (prompt) => {
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
            op: "rewrite_line",
            before: "Built a shared component library adopted by 12 product teams, reducing UI bugs by 30%.",
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
    // The job goes to the model as data.
    expect(promptOf(apiClient.post.mock.calls[0])).toContain(JSON.stringify(JOB));
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
