export const featureVotingContent = {
  heading: "Help shape what we build next",
  columns: {
    building: {
      title: "Currently Building",
      items: [
        {
          id: "desktop-reliability",
          icon: "smartphone",
          label: "Desktop Agent Reliability Suite",
          summary: "Stabilizing auto-apply quality and ATS-safe pacing for launch cohort.",
          progress: 70,
          subfeatures: ["Smart retry queue", "Safe apply cooldowns", "Resume version lock"],
          active: true,
        },
        {
          id: "resume-v2",
          icon: "fileStack",
          label: "Resume Optimizer v2",
          summary: "Context-aware keyword tuning and role-fit scoring per posting.",
          progress: 48,
          subfeatures: ["Role-specific snippets", "Tone adaptation", "Export presets"],
          active: false,
        },
      ],
    },
    voting: {
      title: "Community Voting",
      categories: [
        { id: "all", label: "All" },
        { id: "ai", label: "AI" },
        { id: "integrations", label: "Integrations" },
        { id: "mobile", label: "Mobile" },
      ],
      items: [
        {
          id: "mobile-app",
          icon: "smartphone",
          label: "Mobile Companion App",
          votes: 342,
          category: "mobile",
          details:
            "Track live application status, recruiter responses, and interview reminders from your phone with lightweight approvals for key automations.",
        },
        {
          id: "auto-apply-expansion",
          icon: "zap",
          label: "Auto Apply Expansion",
          votes: 287,
          category: "ai",
          details:
            "Expand role matching coverage with adaptive thresholds so HireDue can safely apply to more relevant openings without quality drop.",
        },
        {
          id: "platform-integrations",
          icon: "puzzle",
          label: "More Platform Integrations",
          votes: 198,
          category: "integrations",
          details:
            "Add connectors for additional ATS and job boards so discovery, apply, and tracking remain unified in one workflow.",
        },
        {
          id: "outreach-tools",
          icon: "messageSquare",
          label: "Better Recruiter Outreach Tools",
          votes: 156,
          category: "ai",
          details:
            "Improve outreach templates, follow-up timing, and personalization controls to increase recruiter response probability.",
        },
        {
          id: "workday-sync",
          icon: "link",
          label: "Workday Direct Sync",
          votes: 141,
          category: "integrations",
          details:
            "Sync role states and application updates directly from Workday to reduce manual checks and stale status confusion.",
        },
      ],
    },
    backlog: {
      title: "Backlog",
      items: [
        { id: "campus-program", icon: "users", label: "Campus Ambassador Program" },
        { id: "referral-board", icon: "network", label: "Internal Referral Board" },
        { id: "team-workspace", icon: "layoutGrid", label: "Team Workspace for Job Clubs" },
      ],
    },
  },
};
