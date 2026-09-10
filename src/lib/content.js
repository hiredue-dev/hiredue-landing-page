import { assets, marks } from "@/lib/assets";

export const nav = {
  brand: "HireDue",
  links: [
    { label: "Features", href: "#features" },
    { label: "Get Started", href: "#how-it-works" },
    { label: "Platform Overview", href: "#overview" },
    { label: "Pricing", href: "#pricing" },
  ],
  cta: { label: "Get Started Free", href: "/signup" },
};

export const hero = {
  title: "Discover, Outreach, Apply. While you sleep.",
  rotatingWords: ["Discovers", "Outreach", "Auto Apply"],
  tagline: "while you sleep",
  description:
    "HireDue scours 50,000+ career pages and top job boards, pitches the right decision-makers, and auto-submits your applications. You just focus on the interview.",
  primary: { label: "Sign Up Free", href: "/signup" },
  secondary: { label: "Join Live Onboarding", href: "/onboarding-call" },
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
    description:
      "Drafts personalized emails and LinkedIn messages to recruiters, then sends them.",
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
  secondary: { label: "Download the App", href: "/download" },
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
  eyebrow: "Get started",
  title: "Four steps from sign-up to live applications",
  description:
    "Most users go from download to their first auto-applied role in under ten minutes.",
  cta: { label: "Download the App", href: "/download" },
  stats: [
    { value: "10 min", label: "Average time to first auto-applied role" },
    { value: "100%", label: "Privacy-first, all your data stays locally" },
  ],
  items: [
    {
      tab: "Step 01",
      title: "Download & Install",
      description:
        "Grab the desktop app — it downloads and installs itself in seconds.",
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
      description:
        "Tell HireDue your expected salary, target locations, and the roles you want.",
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
  local: [
    "Login & session",
    "Saved credentials",
    "Email & message history",
    "Other private data",
  ],
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
      description:
        "Apply to dozens of roles a day without doing each one by hand.",
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
    avatar: assets.founder.sanglap,
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
    "One intelligent system that discovers roles, tailors resumes, applies, and reaches recruiters — on a loop, all day and all night.",
  cards: [
    {
      label: "Morning",
      value: "6:00 AM",
      description: "Scans 50,000+ career pages for roles that opened overnight.",
      icon: "sunrise",
      tone: "light",
      /* position within the 1200 × 1080 stage, in px */
      x: 50,
      y: 130,
    },
    {
      label: "Midday",
      value: "11:00 AM",
      description: "Tailors your resume and auto-applies to the best matches.",
      icon: "sun",
      tone: "primary",
      x: 920,
      y: 120,
    },
    {
      label: "Afternoon",
      value: "3:00 PM",
      description: "Reaches out to recruiters with personalized messages.",
      icon: "cloud-sun",
      tone: "light",
      x: 920,
      y: 710,
    },
    {
      label: "Evening",
      value: "8:00 PM",
      description: "Tracks replies and lines up tomorrow's applications.",
      icon: "sunset",
      tone: "dark",
      x: 460,
      y: 800,
    },
    {
      label: "Night",
      value: "1:00 AM",
      description: "Still working — your agent never clocks out.",
      icon: "moon",
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
    { icon: assets.icons.heart, label: "100+ Testimonials" },
    { icon: assets.icons.users, label: "10K+ Growth community" },
  ],
  cta: { label: "Get Started Free", href: "/signup" },
  items: [
    {
      quote:
        "I can see every role, every tailored resume, and every application without chasing spreadsheets.",
      name: "Megha Joshi",
      role: "Got interview call from Amazon",
    },
    {
      quote:
        "HireDue helped me spend less time searching and more time preparing for the interviews that mattered.",
      name: "Priya Sharma",
      role: "Got interview call from Flipkart",
    },
    {
      quote:
        "The alerts are fast enough that I’m no longer discovering good roles after they’ve already closed.",
      name: "Vikram Iyer",
      role: "Got interview call from Visa",
    },
    {
      quote:
        "The matching is genuinely useful. I found roles I would have missed and had applications moving within days.",
      name: "Rahul Mehta",
      role: "Got interview call from LinkedIn",
    },
    {
      quote:
        "HireDue keeps my search consistent while I balance a full-time job and interview prep.",
      name: "Fatima Khan",
      role: "Got interview call from Deloitte",
    },
    {
      quote:
        "The platform made the volume manageable, and the resume tailoring gave every application more purpose.",
      name: "Aditya Verma",
      role: "Got interview call from Microsoft",
    },
    {
      quote:
        "Automating the repetitive applications gave me back hours every week without losing control of my search.",
      name: "Ananya Patel",
      role: "Got interview call from Swiggy",
    },
    {
      quote:
        "The tailored resume suggestions helped me feel much more confident applying for technical roles.",
      name: "Karan Singh",
      role: "Got interview call from Google",
    },
    {
      quote:
        "I stopped spending evenings on repetitive forms and started focusing on the conversations that move my career forward.",
      name: "Arjun Nair",
      role: "Got interview call from Morgan Stanley",
    },
    {
      quote:
        "Recruiter outreach and application tracking are finally in one calm, clear place.",
      name: "Sneha Reddy",
      role: "Got interview call from Adobe",
    },
  ],
};

export const pricing = {
  eyebrow: "Subscription plans",
  title: "Transparent pricing without hidden fees",
  loading: "Loading plans…",
  error: "Couldn’t load plans right now. Please try again shortly.",
  ctaLabel: "Get started",
  ctaHref: "/signup",
  notes: ["No credit card required", "Cancel anytime"],
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
  items: [
    {
      question: "How does HireDue work?",
      answer:
        "HireDue uses AI to scan job platforms, optimize your resume for each role, automatically submit applications, and reach out to recruiters while you focus on interview prep.",
    },
    {
      question: "Which platforms are supported?",
      answer:
        "HireDue searches LinkedIn, Naukri, Wellfound, and 50,000+ career pages and job boards, and applies through 6+ ATS providers, with more added regularly.",
    },
    {
      question: "Is my data secure?",
      answer:
        "Yes. HireDue is a desktop app, so your sessions, saved credentials, and email history stay encrypted on your device — never on our servers. Only your resume, profile, and billing details sync online.",
    },
    {
      question: "Does HireDue store credentials?",
      answer:
        "Your login credentials are encrypted and stored locally on your machine, not in our cloud. You control what's shared and can revoke access at any time.",
    },
    {
      question: "Is HireDue for students only?",
      answer:
        "No. HireDue is built for students, career switchers, active job seekers, and experienced professionals alike — anyone who wants to automate the repetitive parts of job hunting.",
    },
    {
      question: "Can I control the automation?",
      answer:
        "Yes. You set your preferences — roles, locations, salary, and seniority — and can review, pause, or adjust the automation at any time from the app.",
    },
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
        { label: "Get Started", href: "#how-it-works" },
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
        { label: "Pricing", href: "#pricing" },
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
    {
      name: "Instagram",
      icon: assets.footer.social[0],
      href: process.env.NEXT_PUBLIC_INSTAGRAM_URL,
    },
    {
      name: "LinkedIn",
      icon: assets.footer.social[1],
      href: process.env.NEXT_PUBLIC_LINKEDIN_URL,
    },
    {
      name: "Facebook",
      icon: assets.footer.social[2],
      href: process.env.NEXT_PUBLIC_FACEBOOK_URL,
    },
    {
      name: "X",
      icon: assets.footer.social[3],
      href: process.env.NEXT_PUBLIC_TWITTER_URL,
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  /feature — the template's Feature route, in HireDue's words         */
/* ------------------------------------------------------------------ */
export const featurePage = {
  hero: {
    title: "Be the first one to apply, every time",
    description:
      "One agent that finds the roles, tailors the resume, contacts the recruiter and submits the application — while you only focus on preparing for interviews.",
    stats: [
      {
        value: "50,000+",
        label: "Career pages and job boards scanned every day.",
      },
      {
        value: "24/7",
        label: "The agent keeps working while you only prepare for Interviews.",
      },
    ],
    cta: { label: "Get started now", href: "/signup" },
    secondaryCta: { label: "Live onboarding meet", href: "/onboarding-call" },
  },

  signals: {
    eyebrow: "Under the hood",
    /* the template hard-breaks this headline into two lines */
    title: "Outreach that sounds\nlike you",
    description:
      "HireDue researches the hiring manager, then tailors every note to the role and sends it from your own connected accounts.",
    items: [
      "Write a personal LinkedIn message for every hiring manager",
      "Draft a role-specific email with your strongest experience",
      "Send from your LinkedIn and email — never a generic bot account",
      "Keep every message personal, relevant and in your voice",
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
        description:
          "Download HireDue and sign in — setup takes under two minutes.",
        tone: "surface",
      },
      {
        number: "02",
        title: "Set your preferences",
        description:
          "Roles, locations, salary and seniority. The agent takes it from there.",
        tone: "primary",
      },
      {
        number: "03",
        title: "Let it run",
        description:
          "It discovers, tailors, applies and follows up while you prepare.",
        tone: "dark",
      },
    ],
  },

  depth: {
    eyebrow: "Under the hood",
    title: "Resume that\ngets you noticed",
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
    title: "Works with the Job boards\nyou already use",
    description:
      "Connect the boards and portals you already use and let HireDue work across them.",
    items: [
      {
        name: "LinkedIn",
        icon: marks.linkedin,
        color: "#0a66c2",
        description:
          "Apply through Easy Apply and message recruiters directly.",
      },
      {
        name: "Naukri",
        color: "#2d5fa5",
        description:
          "Find relevant roles across India's largest hiring marketplace.",
      },
      {
        name: "Wellfound",
        icon: marks.wellfound,
        color: "#000000",
        description:
          "Reach startup founders and hiring leads the day a role opens.",
      },
      {
        name: "Foundit",
        color: "#6b3fd4",
        description:
          "Discover matching opportunities and keep applications moving.",
      },
      {
        name: "Monster",
        icon: marks.monster,
        color: "#6d4c9f",
        description:
          "Keep your profile live and applications flowing every day.",
      },
      {
        name: "Handshake",
        icon: marks.handshake,
        color: "#1d1d1d",
        description:
          "Catch campus and early-career roles the moment they post.",
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  /ambassadors — the creator ambassador program                       */
/* ------------------------------------------------------------------ */
export const ambassadorPage = {
  /* Every apply button on the page reads this one value — set
     NEXT_PUBLIC_AMBASSADOR_APPLY_URL and the whole page points at it. */
  applyUrl: process.env.NEXT_PUBLIC_AMBASSADOR_APPLY_URL || "#apply",
  applyLabel: "Apply to the program",

  hero: {
    eyebrow: "Creator Ambassador Program",
    title: "Get paid to talk about HireDue",
    description:
      "Share HireDue with your audience and earn up to $8 for every successful referral.",
    secondary: { label: "See referral earnings", href: "#payouts" },
    stats: [
      { value: "$8", label: "Earned per successful referral" },
      { value: "Tracked", label: "Every purchase through your code or link" },
      { value: "0", label: "Follower minimum to apply" },
    ],
  },

  perks: {
    eyebrow: "What you get",
    title: "A referral program built for creators",
    description:
      "A generous commission, a code that is yours from day one, clear tracking and a team that actually answers.",
    cards: [
      {
        icon: "commission",
        title: "Up to $8 per successful referral",
        description:
          "When someone buys a HireDue plan through your referral, you earn up to $8 — paid for every eligible signup.",
      },
      {
        icon: "payout",
        title: "Simple monthly payouts",
        description:
          "Your successful referrals are totalled each month, so your earnings stay clear and predictable.",
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
    eyebrow: "Referral earnings",
    title: "One clear way to earn",
    description:
      "Share your personal code or link. When someone uses it to buy a plan, you earn up to $8 for that referral.",
    currency: "$",
    perReferral: 8,
    note: "You earn up to $8 for every eligible customer who buys a plan through your referral.",

    estimator: {
      title: "Estimate your referral earnings",
      salesLabel: "Customers who buy with your code",
      commissionLabel: "Referral earnings ($8 each)",
      totalLabel: "Estimated monthly earnings",
      disclaimer:
        "An estimate, not an offer. Final earnings depend on eligible purchases completed through your referral.",
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
          "We total the eligible purchases made through your referral and pay your commission each month.",
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
        question: "How much do I earn per referral?",
        answer:
          "When somebody signs up with your referral code and buys a plan, you earn up to $8 for that referral. They pay the normal price — your earnings come out of our side, not theirs.",
      },
      {
        question: "How are my referrals tracked?",
        answer:
          "Every approved ambassador receives a personal referral code and link. Eligible purchases completed through either one are attributed to your account.",
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
    title: "Your next referral could be earning",
    description:
      "Applications take about two minutes. Tell us where you post and what you make, and we will come back to you.",
  },
};

export const contactPage = {
  hero: {
    eyebrow: "Contact us",
    title: "Get in touch\nwith our team",
    description:
      "Get answers about the platform, pricing, and integrations. Our team is ready to help you land your next role faster.",
    points: [
      "Real support from a real team",
      "Encrypted credentials & sessions",
      "Privacy-first, nothing sold to third parties",
      "Fast responses, no ticket black hole",
    ],
    form: {
      nameLabel: "Full name",
      namePlaceholder: "Enter your full name",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      phoneLabel: "Phone number",
      phonePlaceholder: "Your contact number",
      subjectLabel: "Subject",
      subjectPlaceholder: "How can we help?",
      messageLabel: "Message",
      messagePlaceholder: "Write your message here...",
      submitLabel: "Send Message",
      submittingLabel: "Sending…",
    },
  },
  team: {
    title: "Connect with our team",
    cards: [
      {
        title: "Sales inquiries",
        description: "Talk with our team about plans, pricing, and getting started.",
        email: "support@hiredue.com",
        tone: "light",
      },
      {
        title: "Customer support",
        description: "Get help with your account, the desktop app, or a technical question.",
        email: "support@hiredue.com",
        tone: "dark",
      },
      {
        title: "Partnerships",
        description: "Reach out to explore campus, community, or integration partnerships.",
        email: "support@hiredue.com",
        tone: "brand",
      },
    ],
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "How quickly will I hear back?",
        answer:
          "Our team typically replies within 24 hours on business days. For account or billing issues, email support@hiredue.com directly for the fastest response.",
      },
      {
        question: "Can I get help during onboarding?",
        answer:
          "Yes. If you get stuck connecting your resume, LinkedIn, or job boards, reach out and our team will walk you through setup.",
      },
      {
        question: "Can I change or cancel my plan?",
        answer:
          "You can upgrade, downgrade, or cancel anytime from your account settings — no phone call required. Contact support if you run into any trouble.",
      },
      {
        question: "Do you offer plans for teams or campus placement cells?",
        answer:
          "Yes. Contact our sales team and we'll design a plan for your organization, university, or student cohort.",
      },
      {
        question: "I found a bug or have feedback — where does it go?",
        answer:
          "Email support@hiredue.com with as much detail as you can (screenshots help). We read every message.",
      },
    ],
  },
};

export const downloadPage = {
  eyebrow: "Desktop app",
  title: "Download HireDue",
  description:
    "Install the desktop app to start automating your job search — it's free, and takes under a minute to set up.",
  version: "Version 1.0.1",
  freeNote: "Free to install",
  notice: {
    heading: "Already installed?",
    body: "Open the desktop app and sign in with the same email and password — your subscription and account sync automatically.",
    cta: { label: "Sign up", href: "/signup" },
    altCta: { label: "log in", href: "/login" },
  },
};

export const onboardingCallPage = {
  hero: {
    eyebrow: "Live onboarding",
    title: "Get onboarded\nby our team",
    description:
      "We onboard new users live, every day at 9:30 PM IST — join to see a live demo and optimize your profile with our team.",
    points: [
      "Live demo of the desktop app",
      "We optimize your profile with you, live",
      "Every day at 9:30 PM IST",
      "About 20 minutes, no cost",
    ],
    form: {
      nameLabel: "Full name",
      namePlaceholder: "Enter your full name",
      phoneLabel: "Phone number",
      phonePlaceholder: "Your contact number",
      emailLabel: "Email address",
      emailPlaceholder: "you@example.com",
      dateLabel: "Preferred date",
      submitLabel: "Reserve my seat",
      submittingLabel: "Reserving…",
    },
  },
  faq: {
    title: "Frequently asked questions",
    items: [
      {
        question: "What happens on the call?",
        answer:
          "Our team walks you through a live demo of the desktop app, then helps you optimize your profile — resume, preferences, and connected accounts — so your agent starts strong.",
      },
      {
        question: "What time is the call?",
        answer:
          "We run a live onboarding session every day at 9:30 PM IST. Pick your preferred date in the form and we'll confirm your slot.",
      },
      {
        question: "How long does it take?",
        answer: "About 20 minutes. Just bring your resume and a few minutes of focus.",
      },
      {
        question: "Is there a cost?",
        answer: "No. Onboarding calls are free for every new user, on any plan.",
      },
      {
        question: "What if I can't make it?",
        answer:
          "No problem — email support@hiredue.com and we'll help you pick another date, or point you to a self-serve setup guide instead.",
      },
    ],
  },
};

export const aboutPage = {
  eyebrow: "About HireDue",
  title: "Our story",
  paragraphs: [
    "HireDue started as a single question: what if applying to a job felt as effortless as saving a tab? We watched friends rewrite the same resume thirty different ways for thirty different roles — copy-pasting cover letters, fighting form fields, and second-guessing whether the role was even a fit.",
    "Hiring teams weren't the villains, and candidates weren't lazy. The workflow itself was broken, stitched together from tools that never spoke to each other. So we built HireDue: an AI agent that discovers relevant roles, tailors your resume, reaches out to the right people, and submits your applications automatically — all while you focus on the part that actually moves the needle, preparing for the interview.",
    "Our mission is simple: turn job-search effort into focused interview preparation and better outcomes, and become the most trusted automation layer for job seekers everywhere — fast, accurate, and stress-free, with your data staying exactly where it belongs, with you.",
  ],
};

export const careerPage = {
  hero: {
    eyebrow: "Careers",
    title: "Join a team of builders",
    description:
      "We're looking for ambitious, talented people to help us build the AI layer for job seekers — and ship thoughtful products at startup speed.",
    quote: {
      text: "We are proud to be part of a team creating a thoughtfully crafted product centered on real user outcomes.",
      author: "Arnob",
      role: "Engineering",
    },
  },
  openings: {
    eyebrow: "Open roles",
    title: "Current openings",
    description:
      "We're currently hiring for focused internship roles across the founder's office and engineering.",
    items: [
      {
        title: "Founder's Office Intern (Brand, Content & UI/UX)",
        team: "Founder's Office",
        location: "Remote",
        type: "Internship",
        jdUrl: "https://drive.google.com/file/d/15xifbyFZcdl_-nRUENCMjUqrJzsuAkrz/view?usp=sharing",
      },
      {
        title: "Founder's Office Intern (Management and Outreach)",
        team: "Founder's Office",
        location: "Remote",
        type: "Internship",
        jdUrl: "https://drive.google.com/file/d/1FHu_9kPQB9FlngGlzwNkO6AAWi5hrusv/view?usp=sharing",
      },
      {
        title: "SDE Intern",
        team: "Engineering",
        location: "Remote",
        type: "Internship",
        jdUrl: "https://drive.google.com/file/d/1NbEbOi_vlQUe35a12WDeAgNYdqedLOsq/view?usp=sharing",
      },
    ],
  },
  apply: {
    title: "How to apply",
    description:
      "Choose a role above and submit your application through our shared form. If none match today, apply to our talent pool and we'll reach out when a relevant role opens.",
    cta: { label: "Apply now", href: "https://forms.gle/dVBBpCa7YKrxp6Zj8" },
    fallbackEmail: "careers@hiredue.com",
  },
};
