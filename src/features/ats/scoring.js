/*
 * The ATS score: a fixed, explainable checklist run on the resume's text in the
 * browser. Deterministic on purpose: the same resume always gets the same
 * score, so the before/after of an optimisation measures the edit, not model
 * noise, and an anonymous visitor's resume never leaves their machine to be
 * scored. Points per category add up to 100.
 */

import { mentions } from "./coverage.js";
import { readResume, skillItems, wordCount } from "./resumeText.js";

export const CATEGORIES = [
  { id: "contact", label: "Contact info", max: 10 },
  { id: "sections", label: "Sections", max: 20 },
  { id: "impact", label: "Impact", max: 30 },
  { id: "keywords", label: "Skills & keywords", max: 15 },
  { id: "formatting", label: "Formatting", max: 25 },
];

const ACTION_VERBS = new Set(
  `accelerated achieved administered advised analysed analyzed architected assembled automated boosted built captured championed coached collaborated completed conceived configured consolidated constructed contributed converted coordinated created cut debugged decreased defined delivered deployed designed developed devised directed doubled drove eliminated enabled engineered enhanced established evaluated executed expanded facilitated forecasted formulated founded generated grew guided handled headed identified implemented improved increased initiated innovated instituted integrated introduced investigated launched led maintained managed mentored migrated minimized modernized monitored negotiated optimised optimized orchestrated organized oversaw owned partnered performed piloted pioneered planned prepared presented prioritized produced programmed proposed prototyped published raised rebuilt redesigned reduced refactored reengineered resolved restructured revamped saved scaled secured shipped simplified solved spearheaded standardized streamlined strengthened supervised supported surpassed tested trained transformed tripled troubleshot unified upgraded validated wrote`.split(
    /\s+/,
  ),
);

const WEAK_PHRASES = ["responsible for", "worked on", "helped with", "helped to", "assisted in", "assisted with", "duties included", "involved in", "tasked with", "participated in"];

const QUANTIFIED = /\d|%|\$|₹|€|£|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|dozens?|hundreds?|thousands?|millions?)\b/i;
const DATE = /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+\d{2,4}\b|\b\d{1,2}\/\d{2,4}\b|\b(?:19|20)\d{2}\b|\bpresent\b/gi;
const FIRST_PERSON = /\b(?:i|me|my|myself)\b/gi;

/**
 * @param {string} text  the resume as plain text
 * @returns {{
 *   overall: number,
 *   categories: {id: string, label: string, score: number, max: number}[],
 *   issues: {id: string, category: string, severity: "high"|"medium"|"low", title: string, detail: string, lost: number}[],
 *   stats: {words: number, bullets: number, quantified: number, actionLed: number, skills: number, sections: string[]},
 * }}
 */
export function scoreResume(text) {
  const body = String(text ?? "");
  const resume = readResume(body);
  const words = wordCount(body);
  const bullets = resume.bullets.map((b) => b.text);
  const skills = skillItems(resume.sections.skills?.text);

  const points = Object.fromEntries(CATEGORIES.map((c) => [c.id, 0]));
  const issues = [];
  // Award `got` of `max`; anything short of max becomes an issue unless `issue` is null.
  const check = (category, max, got, issue) => {
    const earned = Math.max(0, Math.min(max, got));
    points[category] += earned;
    const lost = max - earned;
    if (lost > 0.01 && issue) issues.push({ ...issue, category, lost: Math.round(lost * 10) / 10 });
  };

  /* Contact ------------------------------------------------------------ */
  check("contact", 4, /[\w.+-]+@[\w-]+\.[\w.-]+/.test(body) ? 4 : 0, {
    id: "no-email",
    severity: "high",
    title: "No email address found",
    detail: "Recruiters and ATS forms read your email from the resume. Add it to the header.",
  });
  check("contact", 3, /(?:\+?\d[\d\s().-]{8,}\d)/.test(body) ? 3 : 0, {
    id: "no-phone",
    severity: "medium",
    title: "No phone number found",
    detail: "Add a phone number with country code to the header.",
  });
  check("contact", 3, /linkedin\.com\/|github\.com\/|https?:\/\/|www\./i.test(body) ? 3 : 0, {
    id: "no-links",
    severity: "low",
    title: "No LinkedIn or portfolio link",
    detail: "A LinkedIn, GitHub or portfolio URL lets a recruiter check your work in one click.",
  });

  /* Sections ----------------------------------------------------------- */
  const has = (id) => Boolean(resume.sections[id]?.text);
  check("sections", 7, has("experience") ? 7 : has("projects") ? 4 : 0, {
    id: "no-experience",
    severity: "high",
    title: has("projects") ? "No Experience section" : "No Experience or Projects section",
    detail: "ATS parsers look for a heading such as \"Experience\" or \"Work Experience\" to find your roles. Use a standard heading.",
  });
  check("sections", 5, has("education") ? 5 : 0, {
    id: "no-education",
    severity: "medium",
    title: "No Education section",
    detail: "Add an \"Education\" heading, even with a single entry. Many ATS filters check for a degree.",
  });
  check("sections", 6, has("skills") ? 6 : 0, {
    id: "no-skills",
    severity: "high",
    title: "No Skills section",
    detail: "Keyword matching leans on a dedicated \"Skills\" section. List your tools, languages and practices there.",
  });
  check("sections", 2, has("summary") ? 2 : 0, {
    id: "no-summary",
    severity: "low",
    title: "No summary",
    detail: "Two or three lines at the top saying who you are and what you do help both ATS ranking and recruiters.",
  });

  /* Impact ------------------------------------------------------------- */
  const quantified = bullets.filter((b) => QUANTIFIED.test(b)).length;
  const actionLed = bullets.filter((b) => ACTION_VERBS.has(firstWord(b))).length;
  const weak = bullets.filter((b) => WEAK_PHRASES.some((phrase) => b.toLowerCase().includes(phrase)));
  if (!bullets.length) {
    check("impact", 30, 0, {
      id: "no-bullets",
      severity: "high",
      title: "No bullet points describing your work",
      detail: "Describe each role in 3–6 bullets of what you did and what came of it.",
    });
  } else {
    const quantRatio = quantified / bullets.length;
    check("impact", 12, (12 * quantRatio) / 0.5, {
      id: "few-metrics",
      severity: quantRatio < 0.2 ? "high" : "medium",
      title: `${quantified} of ${bullets.length} bullets have a number`,
      detail: "Numbers show scale and results: users, revenue, time saved, % improved. Aim for about half your bullets.",
    });
    const verbRatio = actionLed / bullets.length;
    check("impact", 10, (10 * verbRatio) / 0.7, {
      id: "weak-openers",
      severity: verbRatio < 0.4 ? "medium" : "low",
      title: `${bullets.length - actionLed} bullets don't start with an action verb`,
      detail: "Lead with what you did: \"Built\", \"Led\", \"Reduced\", not \"The project\" or \"Was part of\".",
    });
    check("impact", 8, 8 - 2 * weak.length, {
      id: "weak-phrases",
      severity: "medium",
      title: `${weak.length} bullet${weak.length === 1 ? "" : "s"} use passive phrasing`,
      detail: "\"Responsible for\", \"worked on\" and \"helped with\" describe duties, not results. Say what you delivered.",
    });
  }

  /* Skills & keywords -------------------------------------------------- */
  check("keywords", 10, (10 * skills.length) / 10, {
    id: "few-skills",
    severity: skills.length < 5 ? "high" : "medium",
    title: skills.length ? `Only ${skills.length} skills listed` : "No skills listed",
    detail: "ATS keyword filters match exact terms. List 10–25 specific tools, languages and practices.",
  });
  const workText = bullets.join("\n");
  const backed = skills.filter((skill) => mentions(workText, skill)).length;
  check("keywords", 5, skills.length ? (5 * backed) / Math.min(3, skills.length) : 0, skills.length ? {
    id: "skills-unbacked",
    severity: "low",
    title: "Skills aren't shown in your experience",
    detail: "Mention your key skills inside your bullets too. ATS ranking counts where a keyword appears, not just that it does.",
  } : null);

  /* Formatting --------------------------------------------------------- */
  const lengthPoints = words >= 350 && words <= 900 ? 8 : (words >= 200 && words < 350) || (words > 900 && words <= 1200) ? 4 : 0;
  check("formatting", 8, lengthPoints, {
    id: words < 350 ? "too-short" : "too-long",
    severity: lengthPoints === 0 ? "high" : "medium",
    title: words < 350 ? `Short resume (${words} words)` : `Long resume (${words} words)`,
    detail: words < 350 ? "Most strong resumes run 400–800 words. Add detail to your recent roles." : "Keep it to 1–2 pages: trim older roles and repeated points.",
  });
  check("formatting", 5, body.replace(/\s/g, "").length >= 600 ? 5 : 0, {
    id: "little-text",
    severity: "high",
    title: "Very little text could be read",
    detail: "If your resume is a scanned image or built from text boxes, an ATS may read it as nearly empty. Export it as a text-based PDF or DOCX.",
  });
  const dates = body.match(DATE)?.length ?? 0;
  check("formatting", 4, dates >= 2 ? 4 : 0, {
    id: "no-dates",
    severity: "medium",
    title: "No dates found",
    detail: "Give every role and degree start and end dates (e.g. \"Jan 2022 – Present\").",
  });
  const pronouns = body.match(FIRST_PERSON)?.length ?? 0;
  check("formatting", 4, pronouns <= 2 ? 4 : pronouns <= 6 ? 2 : 0, {
    id: "first-person",
    severity: "low",
    title: "Written in the first person",
    detail: "Drop \"I\" and \"my\": \"Built the payments API\" rather than \"I built my team's payments API\".",
  });
  const longBullets = bullets.filter((b) => wordCount(b) > 35).length;
  check("formatting", 4, bullets.length && longBullets / bullets.length > 0.2 ? 0 : 4, {
    id: "long-bullets",
    severity: "low",
    title: `${longBullets} bullets run over 35 words`,
    detail: "Keep bullets to one or two lines so both an ATS and a skimming recruiter catch the point.",
  });

  const categories = CATEGORIES.map((c) => ({ ...c, score: Math.round(points[c.id]) }));
  const severityRank = { high: 0, medium: 1, low: 2 };
  issues.sort((a, b) => b.lost - a.lost || severityRank[a.severity] - severityRank[b.severity]);

  return {
    overall: Math.round(Object.values(points).reduce((sum, p) => sum + p, 0)),
    categories,
    issues,
    stats: {
      words,
      bullets: bullets.length,
      quantified,
      actionLed,
      skills: skills.length,
      sections: Object.keys(resume.sections),
    },
  };
}

function firstWord(text) {
  return (text.match(/[A-Za-z]+/)?.[0] ?? "").toLowerCase();
}

/** A word for the score, shared by every place that shows one. */
export function scoreBand(score) {
  if (score >= 80) return { label: "Strong", tone: "success" };
  if (score >= 60) return { label: "Good", tone: "brand" };
  if (score >= 40) return { label: "Needs work", tone: "warning" };
  return { label: "Weak", tone: "danger" };
}
