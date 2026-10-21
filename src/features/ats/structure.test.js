import { describe, expect, it } from "vitest";
import { STRONG, STRONG_RESUME } from "./__fixtures__/resumes.js";
import { readResume } from "./resumeText.js";
import { scoreResume } from "./scoring.js";
import { coverageOf, editableLines, promptView, resumeBlocks, resumeToText, toResume } from "./structure.js";

// The kind of text that used to come out as a centred, merged PDF: icon
// glyphs in the contact line, a role header run together with its stack and
// location, and a lone bullet symbol on its own line.
const MESSY = `Arnob Bhakta # arnobbhakta00@gmail.com
ï arnob-bhakta § Arnob-B +91-9477719573
EXPERIENCE
•
TCS Research and Innovation Docker, Exporters, Prometheus, Grafana, Jaeger, Tracing Kolkata
Research Intern : LLM Observability Framework Jun 2026 – Jul 2026
• Benchmarked Ollama-hosted LLMs by measuring latency, throughput, token generation speed, and inference
performance across workloads.
• Built Prometheus-based monitoring pipelines using cAdvisor and Node Exporter to collect and analyze
container and host-level metrics.
EDUCATION
Jadavpur University Sep. 2020 – May 2024`;

const MESSY_ANSWER = {
  name: "Arnob Bhakta",
  headline: "",
  contact: { email: "arnobbhakta00@gmail.com", phone: "+91-9477719573", location: "", links: ["arnob-bhakta", "Arnob-B"] },
  summary: "",
  experience: [
    {
      title: "Research Intern : LLM Observability Framework",
      company: "TCS Research and Innovation",
      location: "Kolkata",
      dates: "Jun 2026 – Jul 2026",
      tech: "Docker, Exporters, Prometheus, Grafana, Jaeger, Tracing",
      bullets: [
        "• Benchmarked Ollama-hosted LLMs by measuring latency, throughput, token generation speed, and inference performance across workloads.",
        "Built Prometheus-based monitoring pipelines using cAdvisor and Node Exporter to collect and analyze container and host-level metrics.",
        "•",
      ],
    },
  ],
  projects: [],
  education: [{ school: "Jadavpur University", degree: "", location: "", dates: "Sep. 2020 – May 2024", details: [] }],
  skills: [],
  certifications: [],
  achievements: [],
  other: [],
};

describe("toResume", () => {
  it("keeps the fields the source backs, in the fixed shape", () => {
    const resume = toResume(MESSY_ANSWER, MESSY);
    expect(resume.experience[0]).toEqual({ ...MESSY_ANSWER.experience[0], bullets: [MESSY_ANSWER.experience[0].bullets[0].slice(2), MESSY_ANSWER.experience[0].bullets[1]] });
    expect(resume.education[0].school).toBe("Jadavpur University");
    expect(Object.keys(resume)).toEqual(["name", "headline", "contact", "summary", "experience", "projects", "education", "skills", "certifications", "achievements", "other"]);
  });

  it("drops a field the model reworded, invented or changed a number in", () => {
    const answer = structuredClone(MESSY_ANSWER);
    answer.experience[0].bullets.push("Led a team of 12 engineers to deliver a cloud migration.");
    answer.experience[0].dates = "Jun 2026 – Jul 2027";
    answer.headline = "Senior Staff Platform Architect";
    const resume = toResume(answer, MESSY);
    expect(resume.experience[0].bullets).toHaveLength(2);
    expect(resume.experience[0].dates).toBe("");
    expect(resume.headline).toBe("");
  });

  it("strips icon-font glyphs and coerces a malformed answer", () => {
    const resume = toResume({ ...MESSY_ANSWER, name: " Arnob Bhakta", contact: "nope", skills: [{ group: "", items: ["Docker", 4, null] }] }, MESSY);
    expect(resume.name).toBe("Arnob Bhakta");
    expect(resume.contact).toEqual({ email: "", phone: "", location: "", links: [] });
    expect(resume.skills).toEqual([{ group: "", items: ["Docker"] }]);
  });

  it("refuses an answer that leaves out much of the resume", () => {
    const answer = { ...MESSY_ANSWER, experience: [] };
    expect(() => toResume(answer, MESSY)).toThrow(expect.objectContaining({ code: "unstructured" }));
    expect(() => toResume(null, MESSY)).toThrow(expect.objectContaining({ code: "unstructured" }));
  });

  it("carries the whole of a well-structured resume", () => {
    expect(coverageOf(STRONG_RESUME, STRONG)).toBeGreaterThan(0.97);
    expect(toResume(STRONG_RESUME, STRONG)).toEqual(STRONG_RESUME);
  });
});

describe("resumeBlocks", () => {
  it("lays every resume out the same way: header, then standard sections in a fixed order", () => {
    const blocks = resumeBlocks(toResume(MESSY_ANSWER, MESSY));
    expect(blocks.map((b) => b.type)).toEqual(["name", "contact", "heading", "entry", "sub", "meta", "bullet", "bullet", "heading", "entry"]);
    expect(blocks[1].text).toBe("arnobbhakta00@gmail.com | +91-9477719573 | arnob-bhakta | Arnob-B");
    expect(blocks[3]).toEqual({ type: "entry", text: "Research Intern : LLM Observability Framework", right: "Jun 2026 – Jul 2026" });
    expect(blocks[4].text).toBe("TCS Research and Innovation | Kolkata");
    expect(blocks.filter((b) => b.type === "heading").map((b) => b.text)).toEqual(["EXPERIENCE", "EDUCATION"]);
    expect(blocks.every((b) => b.text.trim())).toBe(true);
  });

  it("orders sections the same whatever order the resume had them in", () => {
    const headings = resumeBlocks({ ...STRONG_RESUME, other: [{ heading: "Languages", items: ["English", "Hindi"] }] })
      .filter((b) => b.type === "heading")
      .map((b) => b.text);
    expect(headings).toEqual(["SUMMARY", "SKILLS", "EXPERIENCE", "PROJECTS", "EDUCATION", "LANGUAGES"]);
  });
});

describe("resumeToText", () => {
  it("reads back with every section and bullet, and scores like the source", () => {
    const text = resumeToText(STRONG_RESUME);
    const read = readResume(text);
    expect(Object.keys(read.sections)).toEqual(["summary", "skills", "experience", "projects", "education"]);
    expect(read.bullets).toHaveLength(13);
    expect(scoreResume(text).stats).toMatchObject({ bullets: 13, skills: 12 });
    expect(scoreResume(text).overall).toBeGreaterThanOrEqual(scoreResume(STRONG).overall);
  });
});

describe("editableLines / promptView", () => {
  it("gives every changeable line an id, and only those", () => {
    const ids = editableLines(structuredClone(STRONG_RESUME)).map((l) => l.id);
    expect(ids).toHaveLength(14);
    expect(ids.slice(0, 3)).toEqual(["summary", "experience.0.0", "experience.0.1"]);
    const view = promptView(STRONG_RESUME);
    expect(view.experience[1].bullets[2]).toEqual({ id: "experience.1.2", text: STRONG_RESUME.experience[1].bullets[2] });
    expect(view).not.toHaveProperty("name");
    expect(view).not.toHaveProperty("contact");
  });
});
