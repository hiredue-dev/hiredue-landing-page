import { assets } from "@/lib/assets";

/**
 * The blog's content. The template drives these pages from a Framer CMS
 * collection; here the same shape is a plain array, so swapping in a real CMS
 * later only means changing where `posts` comes from.
 */
export const blog = {
  title: "Our blog",
  loadMore: "Load More",
  /** How many cards show before "Load More" — the template starts at six. */
  pageSize: 6,
  otherArticles: "Other articles",
};

export function formatDate(iso) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export const posts = [
  {
    slug: "ai-tools-every-job-seeker-should-be-using",
    category: "AI & hiring",
    date: "2026-08-28",
    title: "AI tools every job seeker should be using",
    description:
      "Candidates are adopting AI-powered tools to find roles earlier, tailor applications faster, and spend their time on interviews instead of forms.",
    cover: assets.blog.covers.aiTools,
    body: [
      { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "A modern job search generates an enormous amount of busywork. New roles appear every hour across dozens of boards and career pages, each one wants the same information in a slightly different format, and the best openings are often filled before a candidate even sees them. AI tools help by turning that repetitive work into something a machine can do while you focus on the parts only you can do.",
      },
      { type: "h3", text: "Why candidates rely on intelligent tools" },
      {
        type: "p",
        text: "Keeping up with several boards, company career pages and recruiter inboxes at once is genuinely hard. AI tools read those listings, compare them against your actual experience, and surface the handful worth your attention instead of the hundred that are not.",
      },
      { type: "quote", text: "Better matches lead to better interviews." },
      {
        type: "p",
        text: "With discovery and form-filling automated, candidates spend less time hunting and more time preparing for the conversations that decide the outcome.",
      },
      { type: "h3", text: "What makes an AI job search tool worth using" },
      { type: "p", text: "The tools that actually help tend to do a few things well:" },
      {
        type: "ul",
        items: [
          "Continuous monitoring of the boards and career pages you care about",
          "Ranking of new roles against your real experience, not just keywords",
          "Rewriting your resume for each posting instead of sending one file everywhere",
          "Reaching the person who owns the role, not just the application inbox",
          "A single place to see what was sent, when, and what came back",
        ],
      },
      {
        type: "p",
        text: "Those capabilities keep you in the running without requiring you to refresh a job board every morning.",
      },
      { type: "h3", text: "Using AI while staying in control" },
      {
        type: "p",
        text: "AI is useful precisely because it is fast, but speed without judgement is how people end up applying to roles they never wanted. The candidate still sets the target: the seniority, the locations, the salary floor, the companies worth talking to. The tool handles the volume underneath those decisions.",
      },
      { type: "h3", text: "Conclusion" },
      {
        type: "p",
        text: "AI is reshaping the job search by removing the repetitive parts of it. Used thoughtfully, these tools help candidates apply earlier, apply better, and arrive at the interview with energy left over.",
      },
    ],
  },

  {
    slug: "building-a-smarter-job-search-with-data",
    category: "Job search",
    date: "2026-08-21",
    title: "Building a smarter job search with data",
    description:
      "Most job searches run on gut feeling. Tracking what you send and what comes back turns the whole thing into something you can actually improve.",
    cover: assets.blog.covers.dataSearch,
    body: [
      { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "Ask most candidates how their search is going and you will get a feeling rather than a number. That is understandable — applications go out into a void and only some of them come back. But a search you cannot measure is a search you cannot fix, and small changes compound quickly once you can see their effect.",
      },
      { type: "h3", text: "What is worth measuring" },
      {
        type: "p",
        text: "You do not need a dashboard full of metrics. A handful of numbers explains almost everything about why a search is or is not working.",
      },
      {
        type: "ul",
        items: [
          "How many roles you saw that genuinely matched your profile",
          "How quickly you applied after a role went live",
          "How many applications produced a human reply",
          "Which companies and titles convert best for you",
          "Where in the funnel candidates like you tend to drop out",
        ],
      },
      {
        type: "p",
        text: "Together those five tell you whether your problem is discovery, timing, positioning, or targeting — and each of those has a different fix.",
      },
      { type: "h3", text: "Timing matters more than most people expect" },
      {
        type: "p",
        text: "Applications submitted in the first hours after a posting goes live are read by a human far more often than ones sent a week later, simply because the pile is still small. If your reply rate is low but your resume is strong, timing is usually the culprit.",
      },
      { type: "quote", text: "Being early is a strategy, not a coincidence." },
      { type: "h3", text: "Turning the numbers into decisions" },
      {
        type: "p",
        text: "Data is only useful if it changes something. A low match rate means your filters are too broad. A high match rate with a low reply rate means your resume is not speaking the language of the posting. Plenty of replies but few final rounds is an interview problem, not an application problem.",
      },
      { type: "h3", text: "Conclusion" },
      {
        type: "p",
        text: "A job search built on data is not colder — it is kinder to you. It replaces the vague sense that nothing is working with a specific thing to change this week.",
      },
    ],
  },

  {
    slug: "getting-past-the-ats-in-modern-hiring",
    category: "Resumes",
    date: "2026-08-12",
    title: "Getting past the ATS in modern hiring",
    description:
      "Applicant tracking systems are the first reader of almost every application. Understanding what they do — and what they do not — changes how you write.",
    cover: assets.blog.covers.ats,
    body: [
      { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "Nearly every mid-size and large employer routes applications through an applicant tracking system before a person sees them. The mythology around these systems is worse than the reality, but the practical consequences are real: how your resume is written and formatted decides whether a recruiter ever opens it.",
      },
      { type: "h3", text: "What an ATS actually does" },
      {
        type: "p",
        text: "An ATS is mostly a database. It parses your resume into structured fields, stores it against the requisition, and gives recruiters a way to search and filter. It does not usually reject you on its own — but a recruiter searching for a specific skill will never find a resume where that skill was parsed incorrectly or never mentioned.",
      },
      { type: "h3", text: "What consistently causes problems" },
      { type: "p", text: "Most parsing failures come from a short list of formatting choices:" },
      {
        type: "ul",
        items: [
          "Multi-column layouts that scramble the reading order",
          "Skills or dates placed inside images, icons or text boxes",
          "Job titles invented internally that nobody searches for",
          "Headers and footers that some parsers ignore entirely",
          "One generic resume sent to postings that use different vocabulary",
        ],
      },
      { type: "quote", text: "Write for the parser first and the reader second — they want the same things." },
      { type: "h3", text: "Tailoring without rewriting from scratch" },
      {
        type: "p",
        text: "The highest-leverage change is matching the posting's own language. If the requisition says \"incident response\" and your resume says \"on-call escalations\", you are describing the same work in a word the recruiter is not searching for. Doing that by hand for every application is exhausting, which is exactly why it is worth automating.",
      },
      { type: "h3", text: "Conclusion" },
      {
        type: "p",
        text: "Getting past an ATS is not about tricks or hidden keywords. It is about making sure a machine can read your experience accurately, so a person gets the chance to judge it.",
      },
    ],
  },

  {
    slug: "why-real-time-job-alerts-matter",
    category: "Job alerts",
    date: "2026-08-04",
    title: "Why real-time job alerts matter",
    description:
      "A daily digest is already a day late. Watching postings as they appear is the difference between the first ten applications and the four hundredth.",
    cover: assets.blog.covers.alerts,
    body: [
      { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "Job boards were built around browsing, and their alerting still reflects that: a summary email once a day, sometimes once a week. For a competitive role, that cadence puts you behind hundreds of other candidates before you have read the description.",
      },
      { type: "h3", text: "How the queue actually fills" },
      {
        type: "p",
        text: "Popular postings collect the bulk of their applications in the first two or three days. Recruiters start screening while applications are still arriving, which means a strong candidate who applies on day five is competing for attention that has already been spent.",
      },
      { type: "quote", text: "The pile only ever grows. Get in while it is short." },
      { type: "h3", text: "What a useful alert contains" },
      { type: "p", text: "Speed is necessary but not sufficient — an alert has to be worth acting on:" },
      {
        type: "ul",
        items: [
          "The role, the company and the compensation range where it is published",
          "A match score against your profile, so you can triage quickly",
          "Whether the posting is new or a repost of something older",
          "How to apply — the ATS link, not just the aggregator listing",
          "Enough context to decide in under a minute",
        ],
      },
      { type: "h3", text: "Watching sources, not just boards" },
      {
        type: "p",
        text: "Many roles appear on a company's own careers page hours or days before they reach an aggregator. Monitoring the source directly is what turns a real-time alert into an actual head start.",
      },
      { type: "h3", text: "Conclusion" },
      {
        type: "p",
        text: "Real-time alerts are not about applying to more roles. They are about applying to the right ones while the queue is still short enough that a person will read what you sent.",
      },
    ],
  },

  {
    slug: "the-role-of-ai-in-tailoring-applications",
    category: "Applications",
    date: "2026-07-24",
    title: "The role of AI in tailoring applications",
    description:
      "Tailoring every application is the advice everyone gives and almost nobody follows, because it does not scale by hand. That is the part worth automating.",
    cover: assets.blog.covers.tailoring,
    body: [
      { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "Every piece of job search advice includes the same line: tailor your resume to the role. It is good advice and it works. It is also, at thirty minutes per application, completely impractical for anyone applying at the volume a real search demands.",
      },
      { type: "h3", text: "What tailoring actually changes" },
      {
        type: "p",
        text: "Tailoring is not rewriting your history. It is reordering it. The same six roles on your resume can emphasise infrastructure work for one posting and data work for another, and the difference in reply rate between those two versions is large.",
      },
      { type: "h3", text: "Where a model helps and where it does not" },
      { type: "p", text: "The useful division of labour looks roughly like this:" },
      {
        type: "ul",
        items: [
          "The model reads the posting and identifies what the role is really asking for",
          "It reorders and reweights your existing bullets to match that emphasis",
          "It aligns your vocabulary with the posting's, without inventing experience",
          "You review the result and keep final say over every claim",
          "Nothing is submitted that you have not approved",
        ],
      },
      { type: "quote", text: "Automate the drafting. Never automate the truth." },
      { type: "h3", text: "Keeping it honest" },
      {
        type: "p",
        text: "A tailored resume that overstates your experience fails at the first technical interview, and it costs you a reference you might have had. The purpose of tailoring is to make real experience legible to a specific reader — not to manufacture a better candidate than you are.",
      },
      { type: "h3", text: "Conclusion" },
      {
        type: "p",
        text: "AI makes tailoring cheap enough to do every single time. Done well, it means the recruiter reads the version of your career that is most relevant to the job they are trying to fill.",
      },
    ],
  },

  {
    slug: "keeping-your-data-safe-in-ai-job-tools",
    category: "Security",
    date: "2026-07-15",
    title: "Keeping your data safe in AI job tools",
    description:
      "A job search tool ends up holding your resume, your contacts and sometimes your logins. It is worth knowing where all of that actually lives.",
    cover: assets.blog.covers.security,
    body: [
      { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "To be useful, a job search tool needs unusually sensitive material: your full work history, your contact details, sometimes credentials for the boards you apply through. That is a lot of trust to hand to a product, and most people hand it over without asking a single question.",
      },
      { type: "h3", text: "The questions worth asking" },
      { type: "p", text: "Before you connect anything, it is fair to ask a vendor:" },
      {
        type: "ul",
        items: [
          "Where does my resume live — on my machine, or on your servers?",
          "Are my job board credentials stored, and if so, how are they encrypted?",
          "Is my data used to train models, and can I opt out?",
          "Who inside the company can read my documents?",
          "What happens to everything if I delete my account?",
        ],
      },
      { type: "quote", text: "If the answers are hard to find, that is an answer." },
      { type: "h3", text: "Why local-first matters here" },
      {
        type: "p",
        text: "A tool that keeps your documents and credentials on your own machine has a much smaller blast radius than one that centralises them. There is no shared store to breach and nothing to leak on someone else's behalf. It is a meaningful architectural difference, not a marketing line.",
      },
      { type: "h3", text: "Reasonable precautions on your side" },
      {
        type: "p",
        text: "Use a unique password for every job board, prefer OAuth over stored passwords where it is offered, and review connected applications occasionally. None of it is difficult, and all of it limits the damage if something goes wrong somewhere else.",
      },
      { type: "h3", text: "Conclusion" },
      {
        type: "p",
        text: "You should not have to choose between a search that runs itself and keeping control of your own data. Pick tools where that is not a trade-off.",
      },
    ],
  },

  {
    slug: "how-integrations-speed-up-your-applications",
    category: "Integrations",
    date: "2026-07-02",
    title: "How integrations speed up your applications",
    description:
      "Every board and ATS wants the same information in its own format. Connecting them is what removes the retyping from a job search.",
    cover: assets.blog.covers.integrations,
    body: [
      { type: "h2", text: "Introduction" },
      {
        type: "p",
        text: "The single most demoralising part of applying for jobs is not writing the resume. It is uploading that resume and then typing its contents into eleven separate form fields, once per application, forever.",
      },
      { type: "h3", text: "Why the retyping exists" },
      {
        type: "p",
        text: "Each applicant tracking system models candidates slightly differently, and each employer configures its own required fields on top of that. The result is that no two application forms are quite the same, even when they are asking for identical information.",
      },
      { type: "h3", text: "What an integration removes" },
      { type: "p", text: "Connecting the platforms you already use collapses most of that work:" },
      {
        type: "ul",
        items: [
          "Your profile fills the form automatically, whatever shape it takes",
          "New postings arrive from the source rather than an aggregator",
          "Screening questions are answered consistently every time",
          "Recruiter messages land in one place instead of five inboxes",
          "Every submission is recorded without you keeping a spreadsheet",
        ],
      },
      { type: "quote", text: "The application should take a minute, not an evening." },
      { type: "h3", text: "Breadth beats depth" },
      {
        type: "p",
        text: "A tool that automates one board perfectly still leaves you doing the rest by hand. Coverage across the boards and ATS platforms you actually encounter is what changes how a week of searching feels.",
      },
      { type: "h3", text: "Conclusion" },
      {
        type: "p",
        text: "Integrations are unglamorous, and they are the difference between applying to four roles a week and forty. That is most of the value of automating a job search.",
      },
    ],
  },
];

export const postBySlug = (slug) => posts.find((p) => p.slug === slug);

/** Three other posts to show under an article, in publication order. */
export const otherPosts = (slug) =>
  posts.filter((p) => p.slug !== slug).slice(0, 3);
