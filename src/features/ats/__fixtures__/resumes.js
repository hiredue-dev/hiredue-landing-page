// Plain-text resumes as extraction produces them: headings on their own line,
// bullets that wrap onto a second line.

export const STRONG = `Priya Sharma
Senior Frontend Engineer
priya.sharma@example.com | +91 98765 43210 | linkedin.com/in/priyasharma | Bengaluru

SUMMARY
Frontend engineer with 8 years building fast, accessible React applications for fintech and e-commerce products used by millions. I care about performance, design systems and helping teams ship with confidence through strong testing culture and clear code reviews.

EXPERIENCE
Razorpay — Senior Frontend Engineer
Jan 2022 – Present
• Led the rebuild of the merchant dashboard in React and TypeScript, cutting load time by 45% for 300,000
merchants.
• Built a shared component library adopted by 12 product teams, reducing UI bugs by 30%.
• Mentored 5 engineers through code reviews and pairing on GraphQL and testing practices.
• Designed an experimentation framework that shipped 40 A/B tests in two quarters.
Flipkart — Frontend Engineer
Jul 2019 – Dec 2021
• Developed checkout flows in React and Redux serving 2 million daily users.
• Improved Lighthouse performance scores from 54 to 91 by code-splitting and image optimization.
• Automated visual regression testing with Jest and Playwright, saving 10 hours a week of QA.

Freshworks — Software Engineer
Aug 2017 – Jun 2019
• Implemented a real-time notification centre in React and WebSockets used by 40,000 support agents.
• Migrated 60 legacy jQuery screens to React components, shrinking the bundle by 35%.
• Partnered with designers to standardize a token-based theme system across three products.
• Wrote integration tests for the ticketing UI, lifting coverage from 38% to 82%.

PROJECTS
• Created an open-source accessibility linter for React with 1,200 GitHub stars and 30 contributors.
• Built a personal finance tracker in Next.js and PostgreSQL that 2,000 people use every month.

EDUCATION
B.Tech, Computer Science — IIT Delhi
2015 – 2019

SKILLS
React, TypeScript, JavaScript, Redux, GraphQL, Node.js, Jest, Playwright, Webpack, CSS, Accessibility, Performance Optimization
`;

export const WEAK = `John Doe
john at email

Work
I was responsible for working on the website and I helped with various tasks that my manager gave me during the
week.
Worked on bugs.
`;

// STRONG as the structuring call should answer it (see structure.js).
export const STRONG_RESUME = {
  name: "Priya Sharma",
  headline: "Senior Frontend Engineer",
  contact: { email: "priya.sharma@example.com", phone: "+91 98765 43210", location: "Bengaluru", links: ["linkedin.com/in/priyasharma"] },
  summary:
    "Frontend engineer with 8 years building fast, accessible React applications for fintech and e-commerce products used by millions. I care about performance, design systems and helping teams ship with confidence through strong testing culture and clear code reviews.",
  experience: [
    {
      title: "Senior Frontend Engineer",
      company: "Razorpay",
      location: "",
      dates: "Jan 2022 – Present",
      tech: "",
      bullets: [
        "Led the rebuild of the merchant dashboard in React and TypeScript, cutting load time by 45% for 300,000 merchants.",
        "Built a shared component library adopted by 12 product teams, reducing UI bugs by 30%.",
        "Mentored 5 engineers through code reviews and pairing on GraphQL and testing practices.",
        "Designed an experimentation framework that shipped 40 A/B tests in two quarters.",
      ],
    },
    {
      title: "Frontend Engineer",
      company: "Flipkart",
      location: "",
      dates: "Jul 2019 – Dec 2021",
      tech: "",
      bullets: [
        "Developed checkout flows in React and Redux serving 2 million daily users.",
        "Improved Lighthouse performance scores from 54 to 91 by code-splitting and image optimization.",
        "Automated visual regression testing with Jest and Playwright, saving 10 hours a week of QA.",
      ],
    },
    {
      title: "Software Engineer",
      company: "Freshworks",
      location: "",
      dates: "Aug 2017 – Jun 2019",
      tech: "",
      bullets: [
        "Implemented a real-time notification centre in React and WebSockets used by 40,000 support agents.",
        "Migrated 60 legacy jQuery screens to React components, shrinking the bundle by 35%.",
        "Partnered with designers to standardize a token-based theme system across three products.",
        "Wrote integration tests for the ticketing UI, lifting coverage from 38% to 82%.",
      ],
    },
  ],
  projects: [
    {
      name: "",
      link: "",
      tech: "",
      dates: "",
      bullets: [
        "Created an open-source accessibility linter for React with 1,200 GitHub stars and 30 contributors.",
        "Built a personal finance tracker in Next.js and PostgreSQL that 2,000 people use every month.",
      ],
    },
  ],
  education: [{ school: "IIT Delhi", degree: "B.Tech, Computer Science", location: "", dates: "2015 – 2019", details: [] }],
  skills: [
    {
      group: "",
      items: ["React", "TypeScript", "JavaScript", "Redux", "GraphQL", "Node.js", "Jest", "Playwright", "Webpack", "CSS", "Accessibility", "Performance Optimization"],
    },
  ],
  certifications: [],
  achievements: [],
  other: [],
};
