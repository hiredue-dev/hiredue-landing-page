import { assets, marks } from "@/lib/assets";

export const nav = {
  brand: "HireDue",
  links: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Use Cases", href: "#use-cases" },
    { label: "Pricing", href: "/pricing" },
  ],
  cta: { label: "Get Started Free", href: "/signup" },
};

export const hero = {
  title: "Discover, Outreach, Apply. While you sleep.",
  description:
    "HireDue scours 50,000+ career pages and top job boards, pitches the right decision-makers, and auto-submits your applications. You just focus on the interview.",
  primary: { label: "Sign Up Free", href: "/signup" },
  secondary: { label: "Download the App", href: "/download" },
  proof: [
    { icon: assets.icons.star, label: "1000+ active users" },
    { icon: assets.icons.shield, label: "Privacy-first, data store locally" },
    { icon: assets.icons.bolt, label: "Be the first one to apply" },
  ],
};

export const clients = {
  label: "Our users got interview calls from",
  logos: assets.clients,
};

export const comparison = {
  title: "Job hunting today is exhausting",
  beforeLabel: "Before HireDue",
  afterLabel: "With HireDue",
  before: {
    heading: "Challenges",
    items: [
      "Endless scrolling for hours across multiple job boards every day",
      "Filling the same repetitive application forms again and again",
      "Great roles close before you even see them",
      "Hundreds of applications sent, barely any replies",
    ],
    stats: [
      { value: "6+", label: "Hours spent daily" },
      { value: "0", label: "Replies received" },
    ],
  },
  after: {
    heading: "With HireDue",
    items: [
      "Smart Match Discovery ranks the most relevant roles instantly across multiple job boards and career pages",
      "Be the first to apply the moment a new role opens",
      "Reach out to the right decision-makers automatically with personalized messages",
      "Auto apply to dozens of roles every day while you focus on interview prep",
    ],
    stats: [
      { value: "200+", label: "Roles discovered daily" },
      { value: "24/7", label: "The agent is active" },
    ],
  },
};

export const features = {
  eyebrow: "Core features",
  title: "Everything you need to land your next role",
  description:
    "Built for job seekers who are done doing this manually — students, career switchers, and experienced professionals alike.",
  cta: { label: "Explore Features", href: "/feature" },
  findJobs: {
    title: "Find Relevant Jobs",
    footnote: "+ 50,000 more career portals",
  },
  resume: { title: "Resume Optimization" },
  outreach: {
    title: "Recruiter Outreach",
    description: "Drafts personalized emails and LinkedIn messages to recruiters, then sends them.",
  },
  autoApply: {
    title: "Auto Apply",
    description:
      "Fills every field from your profile, and writes the open-ended answers with AI.",
  },
  tracking: { title: "Application Tracking" },
};

export const overview = {
  eyebrow: "Platform overview",
  title: "See your job search running in real time",
  description:
    "A live dashboard that brings job discovery, applications, and recruiter outreach together in one clear view.",
  primary: { label: "Explore Features", href: "/feature" },
  secondary: { label: "Try the Live Demo", href: "/signup" },
  cards: [
    {
      icon: assets.overview.iconRocket,
      text: "Every application in one place: Track jobs found, resumes tailored, and applications sent without spreadsheets.",
    },
    {
      icon: assets.overview.iconBolt,
      text: "Move faster: Auto-apply and recruiter outreach run in the background while you prep for interviews.",
    },
    {
      icon: assets.overview.iconBulb,
      text: "Built for focus: A clean dashboard that shows exactly what’s happening with your job search, nothing else.",
    },
  ],
};

export const steps = {
  eyebrow: "How it works",
  title: "Four steps from sign-up to live applications",
  description:
    "Most users go from download to their first auto-applied role in under ten minutes.",
  stats: [
    { value: "10 min", label: "Average time to first auto-applied role" },
    { value: "100%", label: "Privacy-first, all your data stays locally" },
  ],
  items: [
    {
      tab: "Step 01",
      title: "Download & Install",
      description: "Grab the desktop app — it downloads and installs itself in seconds.",
    },
    {
      tab: "Step 02",
      title: "Connect Everything",
      description:
        "Upload your resume and connect Gmail and LinkedIn, plus Wellfound, naukri, and Indeed if you use them.",
    },
    {
      tab: "Step 03",
      title: "Set Your Preferences",
      description: "Tell HireDue your expected salary, target locations, and the roles you want.",
    },
    {
      tab: "Step 04",
      title: "Let It Run",
      description:
        "Keep your laptop on and go grab a coffee — your agent hunts for jobs 24/7, fully automated.",
    },
  ],
};

export const security = {
  eyebrow: "Privacy & security",
  title: "It's a desktop app — your data stays on your device",
  description:
    "HireDue runs locally on your machine. Your sessions, saved credentials, and email history are stored and encrypted right there — never on our servers.",
  cta: { label: "Get Started Free", href: "/signup" },
  points: [
    "Sessions, credentials, and email history are encrypted and stored locally, not in our cloud",
    "Only your resume, profile, and billing details sync online — everything else stays put",
    "You control what's shared, and can revoke access anytime",
    "Privacy-first: your data is never sold to third parties",
  ],
  local: ["Login & session", "Saved credentials", "Email & message history", "Other private data"],
  synced: "Resume, profile & billing sync",
};

export const useCases = {
  eyebrow: "Use cases",
  title: "Who HireDue is built for",
  items: [
    {
      title: "Students & final-year candidates",
      description:
        "Stay consistent during placement season without burning hours on manual applications.",
      statValue: "10 hours",
      statLabel: "Every day saved",
      ...assets.useCases[0],
    },
    {
      title: "Career switchers",
      description:
        "Surface roles you’d never have thought to search for yourself, matched to your real skills.",
      statValue: "Broader",
      statLabel: "Role discovery",
      ...assets.useCases[1],
    },
    {
      title: "Active job seekers",
      description: "Apply to dozens of roles a day without doing each one by hand.",
      statValue: "100+",
      statLabel: "Applications/day automated",
      ...assets.useCases[2],
    },
    {
      title: "Experienced professionals",
      description:
        "Get tailored resumes and recruiter outreach that actually gets replies.",
      statValue: "Nearly 2x",
      statLabel: "Interview response rate",
      ...assets.useCases[3],
    },
  ],
  chips: ["1000+ active users", "Job seekers", "AI-powered", "Privacy-first"],
  quote: {
    text: "“Your time belongs in interviews, not in endless application portals. We built HireDue to do the heavy lifting.”",
    author: "Founder, HireDue",
    avatar: assets.testimonials.avatars.a,
  },
};

export const integrations = {
  eyebrow: "Integrations",
  title: "Connect with the job boards and ATS you already use",
  description:
    "HireDue searches every major job board — LinkedIn, Indeed, and more — and submits through 6+ ATS providers, with new ones added all the time.",
  cta: { label: "Explore all integrations", href: "/feature" },
  footnote: "All major job boards, plus 6+ ATS providers — and growing",
};

export const stats = {
  eyebrow: "HireDue in action",
  title: "Your job search, working around the clock",
  description:
    "One intelligent system for discovering roles, tailoring resumes, applying, and reaching recruiters.",
  cards: [
    {
      label: "Active users",
      value: "300+",
      description: "Job seekers automating their search.",
      icon: assets.stats.users,
      tone: "light",
      /* position within the 1200 × 1080 stage, in px */
      x: 50,
      y: 130,
    },
    {
      label: "Jobs found",
      value: "Live",
      description: "Fresh matching roles, continuously discovered.",
      icon: assets.stats.search,
      tone: "dark",
      x: 920,
      y: 120,
    },
    {
      label: "Applications sent",
      value: "Live",
      description: "Automation running for active users.",
      icon: assets.stats.send,
      tone: "light",
      x: 920,
      y: 710,
    },
    {
      label: "Recruiter messages",
      value: "Live",
      description: "Personalized outreach, automatically sent.",
      icon: assets.stats.globe,
      tone: "primary",
      x: 460,
      y: 800,
    },
    {
      label: "Match quality",
      value: "AI",
      description: "Resume optimization before every submission.",
      icon: assets.stats.bulb,
      tone: "dark",
      x: 20,
      y: 740,
    },
  ],
};

export const testimonials = {
  title: "What job seekers say about HireDue",
  meta: [
    { icon: assets.icons.star, label: "4.9/5 Rating" },
    { icon: assets.icons.heart, label: "75+ Testimonials" },
    { icon: assets.icons.users, label: "10K+ Growth community" },
  ],
  cta: { label: "Get Started Free", href: "/signup" },
  items: [
    {
      quote:
        "I can see every role, every tailored resume, and every application without chasing spreadsheets.",
      name: "Megha Joshi",
      role: "Operations associate",
      avatar: assets.testimonials.avatars.a,
    },
    {
      quote:
        "HireDue helped me spend less time searching and more time preparing for the interviews that mattered.",
      name: "Priya Sharma",
      role: "Final-year candidate",
      avatar: assets.testimonials.avatars.a,
    },
    {
      quote:
        "The alerts are fast enough that I’m no longer discovering good roles after they’ve already closed.",
      name: "Vikram Iyer",
      role: "Product analyst",
      avatar: assets.testimonials.avatars.b,
    },
    {
      quote:
        "The matching is genuinely useful. I found roles I would have missed and had applications moving within days.",
      name: "Rahul Mehta",
      role: "Career switcher",
      avatar: assets.testimonials.avatars.b,
    },
    {
      quote:
        "HireDue keeps my search consistent while I balance a full-time job and interview prep.",
      name: "Fatima Khan",
      role: "Business analyst",
      avatar: assets.testimonials.avatars.c,
    },
    {
      quote:
        "The platform made the volume manageable, and the resume tailoring gave every application more purpose.",
      name: "Aditya Verma",
      role: "Graduate applicant",
      avatar: assets.testimonials.avatars.d,
    },
    {
      quote:
        "Automating the repetitive applications gave me back hours every week without losing control of my search.",
      name: "Ananya Patel",
      role: "Active job seeker",
      avatar: assets.testimonials.avatars.c,
    },
    {
      quote:
        "The tailored resume suggestions helped me feel much more confident applying for technical roles.",
      name: "Karan Singh",
      role: "Software engineer",
      avatar: assets.testimonials.avatars.d,
    },
    {
      quote:
        "I stopped spending evenings on repetitive forms and started focusing on the conversations that move my career forward.",
      name: "Arjun Nair",
      role: "Experienced professional",
      avatar: assets.testimonials.avatars.e,
    },
    {
      quote:
        "Recruiter outreach and application tracking are finally in one calm, clear place.",
      name: "Sneha Reddy",
      role: "Marketing professional",
      avatar: assets.testimonials.avatars.e,
    },
  ],
};

export const pricing = {
  eyebrow: "Subscription plans",
  title: "Transparent pricing without hidden fees",
  monthlyLabel: "Monthly",
  yearlyLabel: "Yearly",
  discountLabel: "20%off",
  plans: [
    {
      name: "Starter plan",
      tagline: "Best for individual investors",
      monthly: 19,
      yearly: 16,
      cta: "Get started",
      ctaHref: "/signup",
      popular: false,
      features: [
        "Connect up to 5 investment accounts",
        "Portfolio performance tracking",
        "Basic AI insights",
        "Market updates & alerts",
        "Real-time price alerts",
        "Email support",
      ],
    },
    {
      name: "Pro plan",
      tagline: "Best for active investors",
      monthly: 39,
      yearly: 32,
      cta: "Get started",
      ctaHref: "/signup",
      popular: true,
      features: [
        "Unlimited account connections",
        "Advanced AI investment insights",
        "Portfolio risk analysis",
        "Smart alerts & automation",
        "Historical performance analytics",
        "Priority support",
      ],
    },
  ],
  notes: ["7-day free trial available", "No credit card required", "Cancel anytime"],
  enterprise: {
    title: "Enterprise plan",
    description:
      "Need a custom solution for your organization? Talk with our team to design a plan for your needs.",
    cta: { label: "Contact sales", href: "/contact" },
  },
};

export const faq = {
  title: "Frequently asked questions",
  description:
    "Find quick answers to common questions about the platform, pricing, and security.",
  aside: {
    title: "Still have questions?",
    description: "Reach out, and our team will guide you.",
    cta: { label: "Talk to our team", href: "/contact" },
  },
  /**
   * Only the first entry has a published answer on the live site — the
   * remaining five are still empty in the source CMS. Fill them in here.
   */
  items: [
    {
      question: "How does HireDue work?",
      answer:
        "HireDue uses AI to scan job platforms, optimize your resume for each role, automatically submit applications, and reach out to recruiters while you focus on interview prep.",
    },
    { question: "Which platforms are supported?", answer: "" },
    { question: "Is my data secure?", answer: "" },
    { question: "Does HireDue store credentials?", answer: "" },
    { question: "Is HireDue for students only?", answer: "" },
    { question: "Can I control the automation?", answer: "" },
  ],
};

export const cta = {
  /* the template hard-breaks this between the two sentences */
  title: "Stop applying.\nStart interviewing.",
  description:
    "HireDue is live. Create your account, install the desktop app, and let it run your job search end to end.",
  primary: { label: "Get Started Free", href: "/signup" },
  secondary: { label: "Download the App", href: "/download" },
};

export const footer = {
  description:
    "Your AI-powered job search automation platform. Spend less time applying, more time preparing.",
  brand: "HireDue",
  email: "support@hiredue.com",
  columns: [
    {
      title: "Quick links",
      links: [
        { label: "Features", href: "#features" },
        { label: "How It Works", href: "#how-it-works" },
        { label: "Use Cases", href: "#use-cases" },
        { label: "Integrations", href: "#integrations" },
      ],
    },
    {
      title: "Pages",
      links: [
        { label: "About", href: "/about" },
        { label: "Feature", href: "/feature" },
        { label: "Ambassadors", href: "/ambassadors" },
        { label: "Blog", href: "/blog" },
        { label: "Career", href: "/career" },
        { label: "Pricing", href: "/pricing" },
        { label: "Download", href: "/download" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQs", href: "#faqs" },
        { label: "Contact", href: "/contact" },
        { label: "Changelog", href: "/changelog" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
      ],
    },
  ],
  copyright: "© 2026 HireDue. All rights reserved.",
  /*
   * Icon order matches assets.footer.social. Each URL comes from the env vars
   * the project already defines; an unset one drops that icon rather than
   * shipping a link that goes nowhere.
   */
  socials: [
    { name: "Instagram", icon: assets.footer.social[0], href: process.env.NEXT_PUBLIC_INSTAGRAM_URL },
    { name: "LinkedIn", icon: assets.footer.social[1], href: process.env.NEXT_PUBLIC_LINKEDIN_URL },
    { name: "Facebook", icon: assets.footer.social[2], href: process.env.NEXT_PUBLIC_FACEBOOK_URL },
    { name: "X", icon: assets.footer.social[3], href: process.env.NEXT_PUBLIC_TWITTER_URL },
  ],
};

/* ------------------------------------------------------------------ */
/*  /feature — the template's Feature route, in HireDue's words         */
/* ------------------------------------------------------------------ */
export const featurePage = {
  hero: {
    title: "Find jobs, Reach out, Apply Automatically.",
    description:
      "One agent that finds the roles, tailors the resume, contacts the recruiter and submits the application — while you only focus on preparing for interviews.",
    stats: [
      { value: "50,000+", label: "Career pages and job boards scanned every day." },
      { value: "24/7", label: "The agent keeps working while you only prepare for Interviews." },
    ],
    cta: { label: "Get started now", href: "/signup" },
  },

  signals: {
    eyebrow: "Under the hood",
    /* the template hard-breaks this headline into two lines */
    title: "Intelligence that works\nwhile you sleep",
    items: [
      "Scan 50,000+ career pages and boards in real time",
      "Rank every opening against your actual profile",
      "Alert you the moment a matching role goes live",
      "Explain why each role was matched, in plain language",
    ],
    cta: { label: "Get started now", href: "/signup" },
  },

  /* Rendered as a connected, step-by-step flow — the order of these entries is
     the order the animation walks, so keep them in run order. */
  capabilities: {
    eyebrow: "Capabilities",
    title: "Everything inside HireDue",
    flow: [
      {
        step: "01",
        icon: "discover",
        title: "Finds the jobs",
        description:
          "Sweeps job boards and company career portals for openings that match your profile.",
      },
      {
        step: "02",
        icon: "connect",
        title: "Connects with recruiters",
        description:
          "Sends connection requests to the recruiters and hiring managers behind each role.",
      },
      {
        step: "03",
        icon: "message",
        title: "Messages them on LinkedIn",
        description:
          "Follows up with a personalised LinkedIn message the moment they accept.",
      },
      {
        step: "04",
        icon: "mail",
        title: "Emails the hiring team",
        description:
          "Delivers a tailored email with your resume straight to their inbox.",
      },
      {
        step: "05",
        icon: "apply",
        title: "Applies on the portal",
        description:
          "Fills and submits the full application on the company's own career portal.",
      },
      {
        step: "06",
        icon: "done",
        title: "Application complete",
        description:
          "Every touchpoint logged and tracked, so you always know where you stand.",
      },
    ],
  },

  steps: {
    eyebrow: "How it works",
    title: "Start applying in minutes",
    description:
      "Install the desktop app, tell it what you are looking for, and let it run your search end to end.",
    items: [
      {
        number: "01",
        title: "Install the app",
        description: "Download HireDue and sign in — setup takes under two minutes.",
        tone: "surface",
      },
      {
        number: "02",
        title: "Set your preferences",
        description: "Roles, locations, salary and seniority. The agent takes it from there.",
        tone: "primary",
      },
      {
        number: "03",
        title: "Let it run",
        description: "It discovers, tailors, applies and follows up while you prepare.",
        tone: "dark",
      },
    ],
  },

  depth: {
    eyebrow: "Under the hood",
    title: "Applications that\ngo deeper",
    description:
      "Most tools blast the same resume everywhere. HireDue rewrites it per role, matches the language of the posting, and files it before the queue fills up.",
    items: [
      "Tailor the resume to every single posting",
      "Mirror the keywords an ATS screens for",
      "Apply within minutes of a role going live",
      "Track every application in one place",
    ],
  },

  integrations: {
    eyebrow: "Integrations",
    title: "Works with the boards\nyou already use",
    description:
      "Connect the boards and portals you already use and let HireDue work across them.",
    items: [
      {
        name: "LinkedIn",
        icon: marks.linkedin,
        color: "#0a66c2",
        description: "Apply through Easy Apply and message recruiters directly.",
      },
      {
        name: "Indeed",
        icon: marks.indeed,
        color: "#003a9b",
        description: "Track new postings and submit applications automatically.",
      },
      {
        name: "Wellfound",
        icon: marks.wellfound,
        color: "#000000",
        description: "Reach startup founders and hiring leads the day a role opens.",
      },
      {
        name: "Greenhouse",
        icon: marks.greenhouse,
        color: "#24a47f",
        description: "Fill company ATS forms end to end without retyping anything.",
      },
      {
        name: "Monster",
        icon: marks.monster,
        color: "#6d4c9f",
        description: "Keep your profile live and applications flowing every day.",
      },
      {
        name: "Handshake",
        icon: marks.handshake,
        color: "#1d1d1d",
        description: "Catch campus and early-career roles the moment they post.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  /ambassadors — the creator ambassador program                       */
/* ------------------------------------------------------------------ */
export const ambassadorPage = {
  /* Every apply button on the page reads this one value — paste the Google
     Form URL here once it exists and the whole page points at it. */
  applyUrl: "#apply",
  applyLabel: "Apply to the program",

  hero: {
    eyebrow: "Creator Ambassador Program",
    title: "Get paid to talk about HireDue",
    description:
      "Make content about the AI agent that finds, contacts and applies to jobs while you sleep. We pay you for the views it earns — and 80% commission on everyone who signs up with your code.",
    secondary: { label: "See how payouts work", href: "#payouts" },
    stats: [
      { value: "80%", label: "Commission on every referred sale" },
      { value: "Monthly", label: "Payouts on the views your content earns" },
      { value: "0", label: "Follower minimum to apply" },
    ],
  },

  perks: {
    eyebrow: "What you get",
    title: "A program built to pay creators properly",
    description:
      "Two income streams from the same post, a code that is yours from day one, and a team that actually answers.",
    cards: [
      {
        icon: "views",
        title: "Paid for your views",
        description:
          "Every video, reel or post you publish about HireDue earns a payout scaled to the views it does. Reviewed and paid out every month.",
      },
      {
        icon: "commission",
        title: "80% commission, every sale",
        description:
          "Anyone who signs up with your referral code and buys a plan pays you 80% of it. Not a finder's fee — the large majority of the sale.",
      },
      {
        icon: "code",
        title: "Your own referral code",
        description:
          "A code and link that belong to you. Drop it in a caption, a bio, a pinned comment or a description — every signup is tracked back to you.",
      },
      {
        icon: "support",
        title: "A direct line to the team",
        description:
          "Product access, answers about what the agent actually does, and early word on what is shipping next, so your content is never guesswork.",
      },
    ],
  },

  payouts: {
    eyebrow: "Payouts",
    title: "Two ways the same post pays you",
    description:
      "One stream rewards the reach your content earns. The other rewards the people it converts. You collect both.",

    /* PLACEHOLDER RATES — swap these for the real rate card before launch.
       `tiers` drives the table and the view half of the estimator; `planPrice`
       and `commission` drive the referral half. */
    placeholder: true,
    currency: "$",
    tiers: [
      { views: 10_000, label: "10K views", payout: 25 },
      { views: 50_000, label: "50K views", payout: 150 },
      { views: 200_000, label: "200K views", payout: 700 },
      { views: 1_000_000, label: "1M+ views", payout: 4_000 },
    ],
    commission: 0.8,
    planPrice: 39,
    note: "Example figures while the rate card is being finalised. Your confirmed rates land in your welcome email.",

    estimator: {
      title: "What a month could look like",
      viewsLabel: "Monthly views on your HireDue content",
      salesLabel: "People who buy with your code",
      viewsPayoutLabel: "Views payout",
      commissionLabel: "Referral commission (80%)",
      totalLabel: "Estimated monthly earnings",
      disclaimer: "An estimate, not an offer. Real payouts follow the confirmed rate card.",
    },
  },

  steps: {
    eyebrow: "How it works",
    title: "Four steps from applying to getting paid",
    items: [
      {
        number: "01",
        title: "Apply",
        description:
          "Send us your handles and the kind of content you make. It takes about two minutes.",
      },
      {
        number: "02",
        title: "Get your code",
        description:
          "Approved creators get a referral code, a link and everything needed to talk about the product accurately.",
      },
      {
        number: "03",
        title: "Post your content",
        description:
          "Your format, your voice. A demo, a job-hunt story, a day-in-the-life — whatever your audience already watches.",
      },
      {
        number: "04",
        title: "Get paid",
        description:
          "We total your views and your referred sales at the end of each month and pay out.",
      },
    ],
  },

  who: {
    eyebrow: "Who we are looking for",
    title: "If people come to you for career advice, this is for you",
    description:
      "There is no follower minimum. We care that your audience is actually job hunting — a small, engaged channel beats a large, unrelated one every time.",
    platforms: ["YouTube", "Instagram", "LinkedIn", "TikTok", "X", "Threads"],
    fits: [
      "Career and job-search creators",
      "Students and campus-placement channels",
      "Tech, dev and AI-tooling reviewers",
      "Resume, interview and upskilling coaches",
      "Newsletter and community operators",
    ],
  },

  faq: {
    title: "Questions before you apply",
    description: "The details creators ask us about most.",
    items: [
      {
        question: "Does it cost anything to join?",
        answer:
          "No. The program is free to apply to and free to be part of. You are never asked to buy anything to take part.",
      },
      {
        question: "How is the 80% commission calculated?",
        answer:
          "When somebody signs up with your referral code and buys a plan, you receive 80% of what they pay for it. They pay the normal price — the commission comes out of our side, not theirs.",
      },
      {
        question: "How are view payouts counted?",
        answer:
          "We count the views on posts you publish about HireDue across the platforms you registered when you applied, and total them at the end of each month against the rate card you were sent.",
      },
      {
        question: "Do I need a minimum number of followers?",
        answer:
          "No. We look at whether your audience is job hunting, not at your follower count. Small, engaged channels are welcome.",
      },
      {
        question: "Do I have to say anything specific in my content?",
        answer:
          "The angle and the format are yours. We only ask that what you say about the product is accurate and that you disclose the partnership the way your platform requires.",
      },
      {
        question: "When and how do I get paid?",
        answer:
          "Payouts are calculated monthly. Approved ambassadors set up their payout details after joining, and we confirm the schedule in your welcome email.",
      },
    ],
  },

  cta: {
    title: "Your next post could be earning",
    description:
      "Applications take about two minutes. Tell us where you post and what you make, and we will come back to you.",
  },
};
