import { APP_VERSION, PLATFORMS } from "@/features/jobs/downloads.js";
import { getPublicPlans } from "@/features/subscription/services/subscriptionService";
import { getPosts } from "@/lib/blog";
import { PRODUCT_DESCRIPTION, SITE_NAME, absoluteUrl } from "@/lib/seo";

// Prices and posts come from the billing API and Sanity, so rebuild hourly.
export const revalidate = 3600;

/*
 * llms.txt (https://llmstxt.org): a plain-text map of the site for AI
 * assistants and answer engines, so they know what HireDue is, what it runs
 * on and costs, and what each page offers.
 */

const SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£" };

/** "₹999 per month", "₹2,499 per 3 months" */
function planPrice(plan) {
  const amount = (plan.price?.price ?? plan.priceMinor) / 100;
  const count = Number(plan.price?.payment_frequency_count) || 1;
  const interval = plan.price?.payment_frequency_interval?.toLowerCase() || "month";
  const symbol = SYMBOLS[plan.currency] ?? `${plan.currency} `;
  const per = count === 1 ? interval : `${count} ${interval}s`;
  return `${symbol}${amount.toLocaleString("en-IN")} per ${per}`;
}

/** "macOS on Apple Silicon (M1 and newer)", "Windows 10 & 11, 64-bit" */
const platformName = (p) => (p.os === "windows" ? p.variant : `${p.name} on ${p.variant}`);

function platformsLine() {
  const live = PLATFORMS.filter((p) => !p.comingSoon).map(platformName);
  const soon = PLATFORMS.filter((p) => p.comingSoon).map(platformName);
  return [
    `Desktop app for ${live.join(" and ")}.`,
    soon.length ? `Coming soon: ${soon.join(", ")}.` : "",
    APP_VERSION ? `Current version: ${APP_VERSION}.` : "",
  ]
    .filter(Boolean)
    .join(" ");
}

async function comparisons() {
  try {
    const posts = await getPosts();
    return posts
      .filter((post) => post.slug.startsWith("hiredue-vs-") && !post.seo?.noIndex)
      .map((post) => `- [${post.title}](${absoluteUrl(`/blog/${post.slug}`)})`);
  } catch {
    return [];
  }
}

export async function GET() {
  const [plans, comparisonLinks] = await Promise.all([getPublicPlans(), comparisons()]);
  const tax = plans.some((p) => p.price && !p.price.tax_inclusive) ? " (plus taxes)" : "";

  const body = `# ${SITE_NAME}

> ${PRODUCT_DESCRIPTION}

## Key facts

- What it is: an AI job search agent that finds jobs, tailors your resume to each one, fills in and submits applications, and sends recruiter outreach by email and LinkedIn.
- Platforms: ${platformsLine()}
${plans.length ? `- Pricing: HireDue Pro costs ${plans.map(planPrice).join(", ")}${tax}. Free to install. Plans and limits: ${absoluteUrl("/#pricing")}\n` : ""}- Job sources: LinkedIn, Indeed, Naukri, Wellfound, Instahyre, Foundit, Monster, Handshake and 50,000+ company career pages.
- Applies through: LinkedIn Easy Apply and applicant tracking systems including Greenhouse, Workday, Lever, Ashby and SmartRecruiters.
- Privacy: runs on your computer. Sessions, saved credentials and email history are encrypted and stored on your device; only your resume, profile and billing details sync online.
- Built for: students in placement season, freshers, career switchers and experienced professionals, in India and worldwide.

## Product

- [Features](${absoluteUrl("/feature")}): The HireDue desktop app finds relevant jobs, tailors a resume for each, and automates repetitive applications.
- [Download](${absoluteUrl("/download")}): Installers for macOS and Windows.
- [Today on HireDue](${absoluteUrl("/today")}): Live count of applications HireDue sent today and recruiter replies this week.

## Free tools

- [Free ATS Resume Checker](${absoluteUrl("/ats-checker")}): Upload a resume (PDF or DOCX) and get an instant ATS score out of 100 with no sign-up. The score covers impact (30), formatting (25), sections (20), skills & keywords (15) and contact info (10), and lists the top issues by points lost. With a free account it also optimizes the resume, tailors it to a pasted job description (showing keyword match before and after), and exports the result as a PDF. Every number, employer and date on the resume stays unchanged.
- [Job board](${absoluteUrl("/jobs")}): Fresh openings from LinkedIn, Naukri, Instahyre, Foundit, Wellfound and company career pages, plus LinkedIn hiring posts, filterable by role, location and date.
${comparisonLinks.length ? `\n## Comparisons\n\n${comparisonLinks.join("\n")}\n` : ""}
## Company

- [About](${absoluteUrl("/about")})
- [Blog](${absoluteUrl("/blog")}): Job search and resume advice.
- [Contact](${absoluteUrl("/contact")}): support@hiredue.com
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
