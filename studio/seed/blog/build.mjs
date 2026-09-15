// Builds the "HireDue vs" comparison posts: renders a cover per post with
// headless Chrome, then writes posts.ndjson for `sanity dataset import`.
//   node seed/blog/build.mjs   (from /studio)
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(dir, "../../..");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const AUTHOR_ID = "author-sanglap-kundu";
const NOTE =
  "_Competitor details come from their public websites and third-party reviews as of September 2026, and may change._";
const CTA = "[try HireDue for free](https://hiredue.com)";

const posts = [
  {
    slug: "hiredue-vs-tsenta",
    competitor: "Tsenta",
    cover: { sub: "AI job agent · cloud", tag: "Easy Apply, outreach and <span>local data</span>", accent: "#ece4ff" },
    title: "HireDue vs Tsenta: which AI job agent fits your search?",
    description:
      "An honest comparison of HireDue and Tsenta: job discovery, auto-apply coverage including Easy Apply, recruiter outreach, where your data lives, and pricing.",
    body: [
      "Tsenta and HireDue are built on the same belief: you shouldn't spend your evenings filling in application forms. Both find roles, tailor your resume and submit applications for you. The differences are in how often they look for jobs, which applications they can finish, whether they reach out to people, and where your data lives. I'm one of the people building HireDue, so read this with that in mind. I've tried to be fair and link to Tsenta's own claims.",
      ["h2", "The short version"],
      ["ul", [
        "**Choose Tsenta** if you mainly apply through company career pages and want to manage your search from your phone, a web dashboard or even iMessage.",
        "**Choose HireDue** if you want one agent that finds fresh roles every hour, applies through both LinkedIn Easy Apply and external job sites, reaches out to recruiters from your own accounts, and keeps your sessions and credentials on your own computer.",
      ]],
      ["h2", "What Tsenta does well"],
      "Tsenta says it watches more than 50,000 career pages across Workday, Greenhouse, Lever, Ashby and 15+ more applicant tracking systems, and submits a tailored resume when a matching role goes up. It's available on the web, iOS, Android, as a Chrome extension and through iMessage, so it's easy to check in from anywhere.",
      "It's also refreshingly upfront. Its site says it doesn't promise that automated applications are undetectable, and its email feature saves recruiter replies to your drafts rather than sending them. Plans start at $19 a month for 600 applications every 30 days, with 25 free applications to try it ([Tsenta](https://tsenta.com)).",
      ["h2", "Where HireDue is different"],
      ["h3", "Fresh jobs every hour"],
      "The first applicants to a role usually get the most attention. HireDue checks for new roles every hour across job boards like LinkedIn, Indeed, Naukri and Wellfound, as well as company career pages, so good openings reach you while they're still fresh.",
      ["h3", "Easy Apply and external applications"],
      "Tsenta submits through company application systems rather than Easy Apply. HireDue does both: it completes LinkedIn Easy Apply forms and external applications on systems like Greenhouse, Workday, Lever, Ashby and SmartRecruiters. It doesn't stop at filling the form. It writes answers to open-ended questions and submits.",
      ["h3", "Outreach from your own accounts"],
      "Applying is only half of it. A short, personal note to a recruiter or hiring manager is often what gets an application read. HireDue drafts personalised messages and sends them from your own LinkedIn and email accounts, so the conversation comes from you and replies land in your inbox.",
      ["h3", "A desktop app, so your data stays local"],
      "HireDue runs as a desktop app on Mac and Windows. Your login sessions, credentials and email history are encrypted and stored on your own computer. Only your resume, profile and billing details sync online. Tsenta is a cloud service across web and mobile, which is convenient, but more of your job search runs on someone else's servers.",
      ["h2", "At a glance"],
      ["ul", [
        "**Job discovery:** Tsenta watches 50,000+ career pages. HireDue checks job boards and career pages every hour.",
        "**Easy Apply:** Tsenta doesn't use Easy Apply. HireDue does.",
        "**External applications:** both submit through major applicant tracking systems. Tsenta lists 19; HireDue supports Greenhouse, Workday, Lever, Ashby, SmartRecruiters and more.",
        "**Recruiter outreach:** Tsenta drafts email replies for you to send. HireDue sends personalised messages from your LinkedIn and email.",
        "**Where it runs:** Tsenta runs on web, mobile, Chrome and iMessage. HireDue is a desktop app with data stored locally.",
        "**Pricing:** Tsenta starts at $19/month after 25 free applications. HireDue has a free plan to get started.",
      ]],
      ["h2", "The honest trade-offs"],
      "If you're rarely at a computer and want to approve roles from your phone, Tsenta's mobile apps are a real advantage. HireDue works from your desktop. And no tool, including ours, can guarantee interviews. What automation can do is make sure you never miss a good role and never send a lazy application.",
      ["h2", "Which should you choose?"],
      `If your target companies hire mostly through their own career pages and you live on your phone, Tsenta is a solid pick. If you want your search to cover LinkedIn Easy Apply as well as external sites, include real outreach to recruiters, and keep your accounts on your own machine, ${CTA}.`,
      NOTE,
    ],
  },
  {
    slug: "hiredue-vs-myjobb-ai",
    competitor: "myjobb AI",
    cover: { sub: "AI job agent · India", tag: "Hourly discovery vs a <span>daily run</span>", accent: "#ffe9d6" },
    title: "HireDue vs myjobb AI: an honest comparison for job seekers in India",
    description:
      "How HireDue and myjobb AI compare on job discovery, auto-apply coverage, referrals and outreach, data privacy and pricing, so you can pick the right agent for your search.",
    body: [
      "myjobb AI calls itself India's first AI job agent, and it's built with the Indian job market front and centre. HireDue works across Indian and global job boards. Both find roles, tailor your resume and apply for you. I'm on the HireDue team, so I'm biased, but I've kept this as fair as I can and linked to myjobb's own claims.",
      ["h2", "The short version"],
      ["ul", [
        "**Choose myjobb AI** if you mainly apply on Naukri, Foundit, Hirist and Instahyre, like a once-a-day routine, and want to manage your search over WhatsApp.",
        "**Choose HireDue** if you want hourly job discovery, applications through LinkedIn Easy Apply and external company sites, outreach sent from your own LinkedIn and email, and a desktop app that keeps your data on your computer.",
      ]],
      ["h2", "What myjobb AI does well"],
      "myjobb says it connects to 15+ job boards and applicant tracking systems, including Naukri, LinkedIn, Foundit, Instahyre, Greenhouse and Ashby. Its agent applies to matched roles on Naukri, Foundit, Hirist and Instahyre at 6 AM IST every day, within an auto-apply window you set.",
      "Each role gets a 0–100 match score, and its resume tailoring highlights the keywords in the job description without inventing experience. You review and approve changes before anything goes out. It also has a referral finder and a WhatsApp assistant. Pricing is simple: 20 free applications, then ₹999 a month ([myjobb AI](https://myjobb.ai)).",
      ["h2", "Where HireDue is different"],
      ["h3", "Every hour, not once a day"],
      "With a daily run, a role posted at 7 AM can wait almost a full day before anyone applies for you. HireDue checks for fresh roles every hour, so you can be among the first applicants. That matters on popular listings that collect hundreds of applications within a day.",
      ["h3", "LinkedIn Easy Apply and company career sites"],
      "myjobb's daily auto-apply runs on Indian job boards. HireDue applies on boards like Naukri and Instahyre too, and also completes LinkedIn Easy Apply and external applications on systems like Greenhouse, Workday, Lever and Ashby. That's important if you're targeting product companies, startups and MNCs that hire through their own career pages.",
      ["h3", "Outreach that comes from you"],
      "Finding a referral is useful; reaching out is what gets results. HireDue writes personalised messages to recruiters and hiring managers and sends them from your own LinkedIn and email accounts, so replies come straight to you.",
      ["h3", "Your data stays on your computer"],
      "HireDue is a desktop app for Mac and Windows. Your job board sessions, passwords and email history are encrypted and stored locally. Only your resume, profile and billing details sync online. myjobb runs as a web app and WhatsApp service, and its site doesn't say where connected account details are stored.",
      ["h2", "At a glance"],
      ["ul", [
        "**Job discovery:** myjobb scouts over a million jobs and applies daily at 6 AM IST. HireDue checks for new roles every hour.",
        "**Where it applies:** myjobb auto-applies on Naukri, Foundit, Hirist and Instahyre. HireDue applies through LinkedIn Easy Apply, job boards and external company application systems.",
        "**Resume tailoring:** both tailor your resume to each role.",
        "**Referrals and outreach:** myjobb has a referral finder. HireDue sends personalised outreach from your LinkedIn and email.",
        "**Where it runs:** myjobb runs on the web and WhatsApp. HireDue is a desktop app with data stored locally.",
        "**Pricing:** myjobb is ₹999/month after 20 free applications. HireDue has a free plan to get started.",
      ]],
      ["h2", "The honest trade-offs"],
      "myjobb's match scores and approve-before-sending flow are great if you want to check every application, and WhatsApp access is handy when you're away from your laptop. HireDue works from your desktop, so it suits you best if you're happy to let it run on your computer while you prepare for interviews.",
      ["h2", "Which should you choose?"],
      `If your search is mostly on Naukri and similar boards, myjobb is a good, affordable option. If you want to cover LinkedIn and company career sites too, reach out to recruiters from your own accounts, and keep your data local, ${CTA}.`,
      NOTE,
    ],
  },
  {
    slug: "hiredue-vs-simplify",
    competitor: "Simplify",
    cover: { sub: "Autofill extension", tag: "Autofill vs a full <span>auto-apply agent</span>", accent: "#d8f5ee" },
    title: "HireDue vs Simplify: autofill or a full auto-apply agent?",
    description:
      "Simplify autofills application forms for free; HireDue finds roles, applies and reaches out for you. An honest look at how the two compare and who each one is for.",
    body: [
      "Simplify is one of the most popular job search tools around, especially with students and new grads, and for good reason. Its Copilot extension is free and genuinely good at filling in forms. But it's a different kind of tool from HireDue. Simplify helps you apply faster; HireDue applies for you. I work on HireDue, so keep that in mind, but here's an honest breakdown.",
      ["h2", "The short version"],
      ["ul", [
        "**Choose Simplify** if you want a free tool, like picking every role yourself, and are happy to click submit on each application.",
        "**Choose HireDue** if you want an agent that finds new roles every hour, submits applications on its own (including LinkedIn Easy Apply), reaches out to recruiters for you, and keeps your data on your computer.",
      ]],
      ["h2", "What Simplify does well"],
      "Simplify's Copilot is a Chrome extension that autofills applications on over 100,000 company career sites. Simplify also offers AI job matching, hand-picked lists of new-grad roles and internships, a resume builder, and a tracker for every application, interview and offer ([Simplify](https://simplify.jobs)).",
      "The autofill and tracker are free. Simplify+ adds AI-tailored resumes, cover letters and networking tools. Its price is shown in the app, and third-party reviews in 2026 report about $39.99 a month.",
      ["h2", "Where HireDue is different"],
      ["h3", "It applies, not just autofills"],
      "With Simplify, you still find each role, open the form, check the autofill and press submit. Simplify's own help pages say you review and submit every application yourself. HireDue completes the whole application, writes answers to open-ended questions and submits it, on LinkedIn Easy Apply and on external systems like Greenhouse, Workday, Lever and Ashby.",
      ["h3", "New roles every hour"],
      "Simplify helps you browse and match jobs, but you have to keep coming back to check. HireDue checks for fresh roles every hour and acts on the ones that match, so a role posted this morning doesn't wait until you next open your laptop.",
      ["h3", "Outreach from your LinkedIn and email"],
      "HireDue writes personalised messages to recruiters and hiring managers and sends them from your own LinkedIn and email accounts. Replies land in your inbox, just as if you'd written them yourself.",
      ["h3", "A desktop app with local data"],
      "Simplify runs as a browser extension and web app. HireDue is a desktop app for Mac and Windows, and your sessions, credentials and email history are encrypted and stored on your own computer. Only your resume, profile and billing details sync online.",
      ["h2", "At a glance"],
      ["ul", [
        "**Applying:** Simplify autofills forms and you submit. HireDue fills and submits for you.",
        "**Coverage:** Simplify autofills on 100,000+ company career sites. HireDue applies through LinkedIn Easy Apply and external company application systems.",
        "**Job discovery:** Simplify offers AI matching and curated lists. HireDue checks for new roles every hour and applies to the ones that fit.",
        "**Outreach:** Simplify+ includes networking tools. HireDue sends personalised outreach from your LinkedIn and email.",
        "**Where it runs:** Simplify is a Chrome extension and web app. HireDue is a desktop app with data stored locally.",
        "**Pricing:** Simplify's autofill is free, and Simplify+ is reported at about $39.99/month. HireDue has a free plan to get started.",
      ]],
      ["h2", "The honest trade-offs"],
      "If you're applying to a small number of roles and want full control over each one, Simplify is excellent, and free is hard to beat. Autofill also means you check every answer. HireDue is built for people applying widely who want their evenings back: you set your preferences, and it does the repetitive work.",
      ["h2", "Which should you choose?"],
      `Students picking a handful of internships will do well with Simplify. If you're applying to dozens of roles a week and want an agent that finds, applies and follows up for you, ${CTA}.`,
      NOTE,
    ],
  },
  {
    slug: "hiredue-vs-jobright",
    competitor: "Jobright",
    cover: { sub: "AI job copilot", tag: "A copilot vs an agent that <span>does the work</span>", accent: "#dcf3dc" },
    title: "HireDue vs Jobright: which AI job tool does more of the work?",
    description:
      "Jobright is strong at matching, coaching and resume tailoring; HireDue focuses on applying and outreach end to end. An honest comparison of features, privacy and pricing.",
    body: [
      "Jobright has built one of the biggest AI job search platforms, with millions of users and a huge job database. HireDue is newer and more focused: we want to take the whole manual part of the job hunt off your plate. I'm part of the HireDue team, so I'm not neutral, but here's a fair look at both.",
      ["h2", "The short version"],
      ["ul", [
        "**Choose Jobright** if you want a large job database, match scores, an AI career coach and help finding insider connections, and don't mind clicking submit yourself.",
        "**Choose HireDue** if you want an agent that finds new roles every hour, applies for you on LinkedIn Easy Apply and external sites, sends outreach from your own accounts, and stores your data on your computer.",
      ]],
      ["h2", "What Jobright does well"],
      "Jobright says it has more than 8 million jobs, with over 400,000 new listings every day, and matches you to roles based on your skills. It includes Orion, a 24/7 AI career copilot, tailored resumes generated in seconds, one-click autofill across major applicant tracking systems, and insider connections that help you find alumni and hiring managers ([Jobright](https://jobright.ai)).",
      "Its paid Turbo plan is widely reported at about $39.99 a month in 2026. Jobright has also been rolling out an AI agent that applies for you, though reviews earlier this year described it as limited or waitlisted for some users.",
      ["h2", "Where HireDue is different"],
      ["h3", "Applying all the way through"],
      "Jobright's main application tool is autofill: it fills in forms, and you check and submit. HireDue completes and submits applications for you, including LinkedIn Easy Apply and external applications on systems like Greenhouse, Workday, Lever and Ashby.",
      ["h3", "Fresh jobs every hour, acted on"],
      "A giant job database is useful, but you still need to spot new roles quickly and act on them. HireDue checks for new roles every hour and applies to the ones that match your preferences, so you're early to the listings that matter.",
      ["h3", "Outreach, not just contacts"],
      "Jobright helps you find insider connections and their emails. HireDue goes a step further: it writes personalised messages and sends them from your own LinkedIn and email accounts, so a recruiter hears from you directly.",
      ["h3", "Local by design"],
      "Jobright is a web platform with a browser extension. HireDue is a desktop app for Mac and Windows. Your sessions, credentials and email history are encrypted and kept on your computer; only your resume, profile and billing details sync online.",
      ["h2", "At a glance"],
      ["ul", [
        "**Job discovery:** Jobright has 8M+ jobs with 400K+ new daily. HireDue checks for new roles every hour.",
        "**Applying:** Jobright autofills in one click, with an AI agent still rolling out. HireDue fills and submits, including Easy Apply.",
        "**Resume tailoring:** both tailor resumes to each role.",
        "**Networking:** Jobright finds insider connections. HireDue sends personalised outreach from your LinkedIn and email.",
        "**Career guidance:** Jobright includes the Orion AI copilot. HireDue focuses on doing the application work so you can prepare.",
        "**Where it runs:** Jobright is a web app plus extension. HireDue is a desktop app with data stored locally.",
        "**Pricing:** Jobright Turbo is reported at about $39.99/month. HireDue has a free plan to get started.",
      ]],
      ["h2", "The honest trade-offs"],
      "If you're early in your search and want coaching, market insights and help deciding what to apply for, Jobright offers more guidance than HireDue does today. HireDue is for when you know what you're looking for and want the finding, applying and outreach done for you.",
      ["h2", "Which should you choose?"],
      `Want an AI copilot to guide you through the search? Jobright is a strong choice. Want an agent that does the applying and outreach while you focus on interviews? Then ${CTA}.`,
      NOTE,
    ],
  },
  {
    slug: "hiredue-vs-lazyapply",
    competitor: "LazyApply",
    cover: { sub: "Auto-apply extension", tag: "Better applications, <span>not just more</span>", accent: "#ffe0ea" },
    title: "HireDue vs LazyApply: quality auto-apply or pure volume?",
    description:
      "LazyApply is built for application volume; HireDue focuses on fresh roles, complete applications and real outreach. An honest comparison of features, reliability, privacy and pricing.",
    body: [
      "LazyApply was one of the first tools to promise fully automated, one-click job applications, and plenty of job seekers have tried it. HireDue also applies for you, but we've made different choices about speed, quality and privacy. I'm on the HireDue team, so weigh that, but here's an honest comparison.",
      ["h2", "The short version"],
      ["ul", [
        "**Choose LazyApply** if your main goal is sending as many applications as possible and you're comfortable with a Chrome extension doing it.",
        "**Choose HireDue** if you want fresh roles every hour, complete and tailored applications on LinkedIn Easy Apply and external sites, outreach from your own accounts, and a desktop app that keeps your data local.",
      ]],
      ["h2", "What LazyApply does well"],
      "LazyApply's Job GPT applies to jobs automatically on platforms like Greenhouse, Dice, Indeed and ZipRecruiter through a Chrome extension. It can send referral emails to employees at companies you apply to, and it tracks everything in a dashboard. Plans are sold annually, from $99 to $999, with daily limits of 15, 150 or 1,500 applications and a 30-day money-back guarantee ([LazyApply](https://lazyapply.com)).",
      "It's also worth knowing what users say. Reviews on Trustpilot are sharply split, with happy users on one side and complaints about incorrectly filled forms, generic answers and support on the other.",
      ["h2", "Where HireDue is different"],
      ["h3", "Quality over raw volume"],
      "Sending 1,500 applications a day sounds impressive, but recruiters can spot a generic application instantly. HireDue tailors your resume to each role and writes answers to open-ended questions from your profile, so each application is one you'd be happy to have sent yourself.",
      ["h3", "Every hour, early in line"],
      "HireDue checks job boards and career pages every hour, so it applies while roles are still fresh. Being one of the first applicants often does more for you than being applicant number 900.",
      ["h3", "Easy Apply and external applications"],
      "HireDue handles LinkedIn Easy Apply and external applications on systems like Greenhouse, Workday, Lever, Ashby and SmartRecruiters, completing each form and submitting it.",
      ["h3", "Outreach from your own accounts"],
      "LazyApply sends referral emails. HireDue writes personalised messages to recruiters and hiring managers and sends them from your own LinkedIn and email, so the conversation is yours from the first message.",
      ["h3", "Desktop app, local data"],
      "LazyApply runs in your Chrome browser. HireDue is a desktop app for Mac and Windows that encrypts your sessions, credentials and email history and stores them on your computer. Only your resume, profile and billing details sync online.",
      ["h2", "At a glance"],
      ["ul", [
        "**Approach:** LazyApply focuses on volume. HireDue focuses on fresh roles and tailored applications.",
        "**Job discovery:** LazyApply applies to listings on the platforms it supports. HireDue checks for new roles every hour.",
        "**Where it applies:** LazyApply covers Greenhouse, Dice, Indeed and ZipRecruiter. HireDue covers LinkedIn Easy Apply, major job boards and external application systems.",
        "**Outreach:** LazyApply sends referral emails. HireDue sends personalised outreach from your LinkedIn and email.",
        "**Where it runs:** LazyApply is a Chrome extension. HireDue is a desktop app with data stored locally.",
        "**Pricing:** LazyApply is $99–$999 a year with daily caps. HireDue has a free plan to get started.",
      ]],
      ["h2", "The honest trade-offs"],
      "If you need to send a very high number of applications quickly, LazyApply's top plan allows more per day than most people will ever need. Whichever tool you use, remember that job sites have their own rules on automation, so keep your activity at a realistic pace.",
      ["h2", "Which should you choose?"],
      `If sheer volume is the goal, LazyApply will get you there. If you'd rather send fewer, better applications to fresh roles and follow up with real people, ${CTA}.`,
      NOTE,
    ],
  },
];

let keyN = 0;
const key = () => `k${(keyN++).toString(36).padStart(5, "0")}`;

// Inline markup: **bold**, _italic_ (whole block), [text](url).
function inline(text) {
  const markDefs = [];
  const children = [];
  let marks = [];
  if (/^_.*_$/.test(text)) {
    text = text.slice(1, -1);
    marks = ["em"];
  }
  for (const part of text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/)) {
    if (!part) continue;
    const bold = part.match(/^\*\*(.+)\*\*$/);
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (bold) children.push({ _type: "span", _key: key(), text: bold[1], marks: [...marks, "strong"] });
    else if (link) {
      const _key = key();
      markDefs.push({ _type: "link", _key, href: link[2] });
      children.push({ _type: "span", _key: key(), text: link[1], marks: [...marks, _key] });
    } else children.push({ _type: "span", _key: key(), text: part, marks });
  }
  return { markDefs, children };
}

const block = (text, style = "normal", extra = {}) => ({
  _type: "block",
  _key: key(),
  style,
  ...inline(text),
  ...extra,
});

function toPortableText(body) {
  return body.flatMap((item) => {
    if (typeof item === "string") return [block(item)];
    const [type, value] = item;
    if (type === "ul") return value.map((li) => block(li, "normal", { listItem: "bullet", level: 1 }));
    return [block(value, type)];
  });
}

const coverDir = path.join(dir, "covers");
mkdirSync(coverDir, { recursive: true });
const template = pathToFileURL(path.join(dir, "cover.html"));

const docs = [
  {
    _id: AUTHOR_ID,
    _type: "author",
    name: "Sanglap Kundu",
    role: "Founder, HireDue",
    bio: "Founder at HireDue, building a candidate-first AI agent that takes the manual work out of job hunting.",
    image: {
      _type: "image",
      alt: "Sanglap Kundu",
      _sanityAsset: `image@${pathToFileURL(path.join(repo, "public/assets/AboutUs/SanglapKundu.png"))}`,
    },
  },
];

posts.forEach((post, i) => {
  const png = path.join(coverDir, `${post.slug}.png`);
  const jpg = path.join(coverDir, `${post.slug}.jpg`);
  const url = new URL(template);
  url.search = new URLSearchParams({ name: post.competitor, ...post.cover }).toString();
  execFileSync(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=2",
    "--window-size=1200,680",
    "--virtual-time-budget=2000",
    `--screenshot=${png}`,
    url.href,
  ], { stdio: "ignore" });
  execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "90", png, "--out", jpg], { stdio: "ignore" });

  docs.push({
    _id: `post-${post.slug}`,
    _type: "post",
    title: post.title,
    slug: { _type: "slug", current: post.slug },
    category: "AI & hiring",
    description: post.description,
    cover: {
      _type: "image",
      alt: `HireDue vs ${post.competitor} comparison cover`,
      _sanityAsset: `image@${pathToFileURL(jpg)}`,
    },
    author: { _type: "reference", _ref: AUTHOR_ID },
    publishedAt: new Date(Date.UTC(2026, 8, 14, 10, 0 - i * 5)).toISOString(),
    body: toPortableText(post.body),
  });
});

writeFileSync(path.join(dir, "posts.ndjson"), docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`Wrote ${docs.length} documents and ${posts.length} covers`);
