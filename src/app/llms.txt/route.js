import { DEFAULT_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo";

export const dynamic = "force-static";

/*
 * llms.txt (https://llmstxt.org): a plain-text map of the site for AI
 * assistants and answer engines, so they know what each page offers.
 */
const body = `# ${SITE_NAME}

> ${DEFAULT_DESCRIPTION}

## Free tools

- [Free ATS Resume Checker](${absoluteUrl("/ats-checker")}): Upload a resume (PDF or DOCX) and get an instant ATS score out of 100 with no sign-up. The score covers impact (30), formatting (25), sections (20), skills & keywords (15) and contact info (10), and lists the top issues by points lost. With a free account it also optimizes the resume, tailors it to a pasted job description (showing keyword match before and after), and exports the result as a PDF. Every number, employer and date on the resume stays unchanged.
- [Job board](${absoluteUrl("/jobs")}): Fresh openings from LinkedIn, Naukri, Instahyre, Foundit, Wellfound and company career pages, plus LinkedIn hiring posts, filterable by role, location and date.

## Product

- [Features](${absoluteUrl("/feature")}): The HireDue desktop app finds relevant jobs, tailors a resume for each, and automates repetitive applications.
- [Download](${absoluteUrl("/download")}): Get the HireDue desktop app.
- [Blog](${absoluteUrl("/blog")}): Job search and resume advice.

## Company

- [About](${absoluteUrl("/about")})
- [Contact](${absoluteUrl("/contact")})
`;

export function GET() {
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
