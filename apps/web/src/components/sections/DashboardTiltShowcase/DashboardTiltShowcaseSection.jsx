import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import {
  Bell,
  Briefcase,
  CalendarCheck2,
  ChartColumnBig,
  ChevronDown,
  Gauge,
  GitBranch,
  HelpCircle,
  LayoutDashboard,
  Link,
  Mail,
  MessageSquare,
  Network,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  Target,
} from "lucide-react";
import styles from "./DashboardTiltShowcaseSection.module.css";

const sidebarTabs = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, area: "main" },
  { id: "applications", label: "Applications", icon: Briefcase, area: "main" },
  { id: "ats", label: "ATS", icon: GitBranch, area: "main" },
  { id: "network", label: "Network", icon: Network, area: "main" },
  { id: "settings", label: "Settings", icon: Settings, area: "bottom" },
];

const tabMeta = {
  dashboard: {
    eyebrow: "System Overview",
    title: "Activity Trend",
    subtitle: "System performance and throughput across all active agents.",
  },
  applications: {
    eyebrow: "Applications",
    title: "Applications",
    subtitle: "Track every role, status, and outcome in one place.",
  },
  ats: {
    eyebrow: "ATS",
    title: "ATS",
    subtitle: "Track and manage your candidate pipeline and matching status in real-time.",
  },
  network: {
    eyebrow: "Network",
    title: "Network",
    subtitle: "Track and manage your connection requests.",
  },
  settings: {
    eyebrow: "Settings",
    title: "Settings",
    subtitle: "Manage your automation preferences and professional profile.",
  },
};

const metricCards = [
  {
    title: "Posts Analysed",
    value: "12,450",
    icon: ChartColumnBig,
    iconTone: "primary",
    logs: [
      { label: "LinkedIn Feed Scan", time: "2 mins ago", status: "Success", tone: "success" },
      { label: "Indeed API Fetch", time: "14 mins ago", status: "Success", tone: "success" },
      { label: "Naukri Query", time: "42 mins ago", status: "Partial", tone: "warn" },
    ],
  },
  {
    title: "Jobs Identified",
    value: "842",
    icon: Target,
    iconTone: "blue",
    logs: [
      { label: "Senior UI Designer", time: "5 mins ago", status: "Matched", tone: "info" },
      { label: "Product Architect", time: "1h ago", status: "Matched", tone: "info" },
    ],
  },
  {
    title: "Applications Sent",
    value: "156",
    icon: Send,
    iconTone: "violet",
    logs: [
      { label: "Stripe - UI Engineer", time: "12 mins ago", status: "Sent", tone: "success" },
      { label: "Vercel - Lead Designer", time: "4h ago", status: "Sent", tone: "success" },
    ],
  },
  {
    title: "Interviews Booked",
    value: "12",
    icon: CalendarCheck2,
    iconTone: "green",
    logs: [
      { label: "Meta - Intro Call", time: "Oct 24, 2:00 PM", status: "Confirmed", tone: "info" },
      { label: "Ramp - Design Sync", time: "Oct 26, 11:00 AM", status: "Confirmed", tone: "info" },
    ],
  },
  {
    title: "CVs Tailored",
    value: "156",
    icon: Sparkles,
    iconTone: "orange",
    logs: [{ label: "Stripe Variant V3", time: "15 mins ago", status: "Ready", tone: "success" }],
  },
  {
    title: "LinkedIn Outreach",
    value: "320",
    icon: MessageSquare,
    iconTone: "indigo",
    logs: [{ label: "John Doe (Meta)", time: "8 mins ago", status: "Replied", tone: "violet" }],
  },
];

const applicationsData = [
  {
    company: "Spotify",
    role: "Senior Product Designer",
    location: "New York, NY (Remote)",
    match: "94% Match",
    status: "Interviewing",
    salary: "$140k - $185k",
    appliedAgo: "Applied 2d ago",
    cta: "View Details",
    logoTone: "green",
  },
  {
    company: "Stripe",
    role: "UX Research Lead",
    location: "San Francisco, CA",
    match: "88% Match",
    status: "Applied",
    salary: "$165k - $210k",
    appliedAgo: "Applied 5d ago",
    cta: "View Details",
    logoTone: "navy",
  },
  {
    company: "Airbnb",
    role: "Interface Engineer",
    location: "Remote",
    match: "91% Match",
    status: "Rejected",
    salary: "$150k - $190k",
    appliedAgo: "Applied 12d ago",
    cta: "View Details",
    logoTone: "rose",
  },
  {
    company: "Figma",
    role: "Design Systems Designer",
    location: "London, UK",
    match: "97% Match",
    status: "New Offer",
    salary: "$180k - $220k",
    appliedAgo: "Applied 14d ago",
    cta: "Review Offer",
    logoTone: "indigo",
  },
  {
    company: "Spotify",
    role: "Lead UX Designer",
    location: "Stockholm, Sweden (Remote)",
    match: "92% Match",
    status: "Applied",
    salary: "$150k - $190k",
    appliedAgo: "Applied 15d ago",
    cta: "View Details",
    logoTone: "green",
  },
  {
    company: "Stripe",
    role: "Frontend Architect",
    location: "Seattle, WA",
    match: "95% Match",
    status: "Interviewing",
    salary: "$180k - $230k",
    appliedAgo: "Applied 16d ago",
    cta: "View Details",
    logoTone: "navy",
  },
  {
    company: "Airbnb",
    role: "Motion Designer",
    location: "San Francisco, CA",
    match: "85% Match",
    status: "Applied",
    salary: "$130k - $170k",
    appliedAgo: "Applied 18d ago",
    cta: "View Details",
    logoTone: "rose",
  },
  {
    company: "Figma",
    role: "Product Engineer",
    location: "San Francisco, CA",
    match: "89% Match",
    status: "Rejected",
    salary: "$160k - $200k",
    appliedAgo: "Applied 20d ago",
    cta: "View Details",
    logoTone: "indigo",
  },
];

const atsColumns = [
  {
    title: "Relevant Job Posts",
    count: 3,
    dotTone: "orange",
    cards: [
      { company: "Google", match: "98% Match", role: "Senior Frontend Engineer", location: "Mountain View, CA" },
      { company: "Meta", match: "94% Match", role: "Product Designer", location: "Menlo Park, CA" },
      { company: "Amazon", match: "89% Match", role: "Software Development Manager", location: "Seattle, WA" },
    ],
  },
  {
    title: "Connection Sent",
    count: 2,
    dotTone: "gold",
    cards: [
      { company: "Microsoft", match: "91% Match", role: "Azure Solutions Architect", location: "Redmond, WA" },
      { company: "Netflix", match: "87% Match", role: "Content Strategist", location: "Los Gatos, CA" },
    ],
  },
  {
    title: "Message/Mail Sent",
    count: 2,
    dotTone: "violet",
    cards: [
      { company: "Apple", match: "95% Match", role: "iOS Developer", location: "Cupertino, CA" },
      { company: "Tesla", match: "90% Match", role: "Autopilot Engineer", location: "Palo Alto, CA" },
    ],
  },
];

const networkStats = [
  { label: "Total Network", value: "1,284" },
  { label: "Accepted", value: "1,218" },
  { label: "Pending", value: "24" },
  { label: "Req. Pending", value: "24" },
  { label: "Growth", value: "42" },
];

const networkPeople = [
  {
    initials: "M",
    name: "Marcus Thorne",
    role: "Senior Product Designer at Linear",
    dateLabel: "Sent May 12, 2024",
    status: "Pending",
    tone: "warn",
  },
  {
    initials: "S",
    name: "Sarah Jenkins",
    role: "Talent Acquisition Specialist at Meta",
    dateLabel: "Accepted May 10, 2024",
    status: "Accepted",
    tone: "success",
  },
  {
    initials: "D",
    name: "David Wu",
    role: "VP of Engineering at Datadog",
    dateLabel: "Sent May 08, 2024",
    status: "Rejected",
    tone: "danger",
  },
  {
    initials: "E",
    name: "Elena Rodriguez",
    role: "CTO at TechFlow",
    dateLabel: "Accepted May 05, 2024",
    status: "Accepted",
    tone: "success",
  },
];

const settingsConnections = [
  { name: "LinkedIn", status: "Error", tone: "error", icon: Link },
  { name: "Gmail", status: "Active", tone: "success", icon: Mail },
];

const settingsFlows = [
  {
    title: "Auto-apply to matches",
    desc: "Automatically submit applications for 90%+ matches.",
    enabled: true,
    icon: Send,
  },
  {
    title: "Auto-message Recruiters",
    desc: "Send personalized intros to hiring managers.",
    enabled: false,
    icon: MessageSquare,
  },
];

const statusClassMap = {
  Interviewing: "applicationStatusInterviewing",
  Applied: "applicationStatusApplied",
  Rejected: "applicationStatusRejected",
  "New Offer": "applicationStatusOffer",
};

const DashboardTiltShowcaseSection = () => {
  const ref = useRef(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 12%"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 0.48, 1], [22, 0, 0]);
  const y = useTransform(scrollYProgress, [0, 0.48, 1], [92, 0, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.48, 1], [0.93, 1, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.48, 1], [0.78, 1, 1]);
  const meta = tabMeta[activeTab] || tabMeta.dashboard;

  const renderDashboardContent = () => (
    <section className={styles.dashboardTabBody}>
      <section className={styles.trendCard}>
        <div className={styles.trendTop}>
          <div>
            <h3>{meta.title}</h3>
            <p>{meta.subtitle}</p>
          </div>
          <div className={styles.trendControls}>
            <span className={styles.trendBadge}>+2.5%</span>
            <span className={styles.trendSelect}>
              Last 7 Days <ChevronDown size={14} />
            </span>
          </div>
        </div>
        <div className={styles.chartArea}>
          <svg className={styles.chartSvg} viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="activityArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 172 Q 96 156, 184 162 T 396 92 T 612 126 T 812 56 T 1000 76 L 1000 220 L 0 220 Z" fill="url(#activityArea)" />
            <path d="M0 172 Q 96 156, 184 162 T 396 92 T 612 126 T 812 56 T 1000 76" />
            <line x1="0" x2="1000" y1="52" y2="52" />
            <line x1="0" x2="1000" y1="112" y2="112" />
            <line x1="0" x2="1000" y1="172" y2="172" />
          </svg>
          <div className={styles.chartDays}>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </section>

      <div className={styles.metricsGrid}>
        {metricCards.map((card, index) => (
          <motion.article
            key={card.title}
            className={styles.metricCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: 0.05 + index * 0.035 }}
          >
            <div className={styles.metricHead}>
              <div>
                <p className={styles.metricTitle}>{card.title}</p>
                <p className={styles.metricValue}>{card.value}</p>
              </div>
              <span className={`${styles.metricIcon} ${styles[`tone${card.iconTone[0].toUpperCase()}${card.iconTone.slice(1)}`]}`.trim()}>
                <card.icon size={15} />
              </span>
            </div>

            <div className={styles.logList}>
              <p className={styles.logsHeader}>Recent Actions</p>
              {card.logs.map((log) => (
                <div key={log.label} className={styles.logRow}>
                  <div>
                    <p>{log.label}</p>
                    <span>{log.time}</span>
                  </div>
                  <em className={`${styles.logTone} ${styles[`logTone${log.tone[0].toUpperCase()}${log.tone.slice(1)}`]}`.trim()}>
                    {log.status}
                  </em>
                </div>
              ))}
            </div>
          </motion.article>
        ))}

        <motion.article
          className={`${styles.metricCard} ${styles.metricCardWide}`.trim()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
        >
          <div className={styles.metricHead}>
            <div>
              <p className={styles.metricTitle}>Agent Efficiency</p>
              <p className={styles.metricValue}>94%</p>
            </div>
            <span className={`${styles.metricIcon} ${styles.toneTeal}`.trim()}>
              <Gauge size={15} />
            </span>
          </div>

          <div className={styles.efficiencyGrid}>
            <div>
              <p className={styles.logsHeader}>Performance Logs</p>
              <div className={styles.logRow}>
                <div>
                  <p>Logic Gate Check</p>
                  <span>Stable</span>
                </div>
                <em className={`${styles.logTone} ${styles.logToneSuccess}`.trim()}>Optimal</em>
              </div>
            </div>
            <div className={styles.workloadCard}>
              <div className={styles.workloadHead}>
                <span>Workload Balance</span>
                <strong>88%</strong>
              </div>
              <div className={styles.workloadBar}>
                <span />
              </div>
            </div>
          </div>
        </motion.article>
      </div>

      <footer className={styles.dashboardFooter}>
        <p>© 2026 HireDue Platforms Inc. All systems operational.</p>
        <div className={styles.footerStatus}>
          <span>Cloud Engine v2.4.1</span>
          <span>Scraper Node: EU-West</span>
        </div>
      </footer>
    </section>
  );

  const renderApplicationsContent = () => (
    <section className={styles.tabBodyWrap}>
      <section className={styles.applicationsWrap}>
        <header className={styles.applicationsHeader}>
          <div className={styles.applicationsTitleRow}>
            <h3>Applications</h3>
            <span className={styles.applicationsTotal}>24 Total</span>
          </div>
          <div className={styles.applicationsSearchBar}>
            <Search size={14} />
            <span>Search by job title, company, or location...</span>
          </div>
          <div className={styles.applicationsFilters}>
            <button type="button" className={styles.filterPill}>
              Status <ChevronDown size={14} />
            </button>
            <button type="button" className={styles.filterPill}>
              Job Type <ChevronDown size={14} />
            </button>
            <button type="button" className={styles.filterPill}>
              Date Applied <ChevronDown size={14} />
            </button>
            <div className={styles.salaryRange}>
              <span>SALARY:</span>
              <div>
                <em />
                <strong />
              </div>
              <p>$100k+</p>
            </div>
          </div>
        </header>

        <div className={styles.applicationsList}>
          {applicationsData.map((item) => (
            <article key={`${item.company}-${item.role}`} className={styles.applicationRow}>
              <div className={styles.applicationIdentity}>
                <span className={`${styles.applicationLogo} ${styles[`applicationLogo${item.logoTone[0].toUpperCase()}${item.logoTone.slice(1)}`]}`.trim()}>
                  {item.company[0]}
                </span>
                <div className={styles.applicationInfo}>
                  <h4>{item.role}</h4>
                  <p>
                    <strong>{item.company}</strong> • {item.location} • <em className={styles.applicationMatch}>{item.match}</em>
                  </p>
                </div>
              </div>

              <span className={`${styles.applicationStatus} ${styles[statusClassMap[item.status]]}`.trim()}>{item.status}</span>

              <div className={styles.applicationSalary}>
                <strong className={styles.applicationSalaryValue}>{item.salary}</strong>
                <span className={styles.applicationSalaryHint}>Expected Salary</span>
              </div>

              <div className={styles.applicationApplied}>
                <span>{item.appliedAgo}</span>
                <button type="button" className={styles.applicationAction}>
                  {item.cta} +
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );

  const renderAtsContent = () => (
    <section className={styles.tabBodyWrap}>
      <div className={styles.atsGrid}>
        {atsColumns.map((column) => (
          <article key={column.title} className={styles.atsColumn}>
            <header className={styles.atsColumnHeader}>
              <div>
                <span className={`${styles.atsDot} ${styles[`atsDot${column.dotTone[0].toUpperCase()}${column.dotTone.slice(1)}`]}`.trim()} />
                <h4>{column.title}</h4>
              </div>
              <strong>{column.count}</strong>
            </header>
            <div className={styles.atsCards}>
              {column.cards.map((card) => (
                <div key={`${column.title}-${card.company}`} className={styles.atsCard}>
                  <div className={styles.atsCardHead}>
                    <h5>{card.company}</h5>
                    <span>{card.match}</span>
                  </div>
                  <dl>
                    <div>
                      <dt>Role</dt>
                      <dd>{card.role}</dd>
                    </div>
                    <div>
                      <dt>Location</dt>
                      <dd>{card.location}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const renderNetworkContent = () => (
    <section className={styles.tabBodyWrap}>
      <div className={styles.networkControls}>
        <div className={styles.networkSearch}>Search connections...</div>
        <button type="button" className={styles.networkFilter}>
          All Status <ChevronDown size={14} />
        </button>
      </div>

      <div className={styles.networkStatsGrid}>
        {networkStats.map((item) => (
          <article key={item.label} className={styles.networkStatCard}>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
          </article>
        ))}
      </div>

      <div className={styles.networkList}>
        {networkPeople.map((person) => (
          <article key={person.name} className={styles.networkPersonCard}>
            <div className={styles.networkPersonMain}>
              <span className={styles.networkAvatar}>{person.initials}</span>
              <div>
                <h4>{person.name}</h4>
                <p>{person.role}</p>
                <div className={styles.networkMetaRow}>
                  <span>{person.dateLabel}</span>
                  <em className={`${styles.networkStatus} ${styles[`networkStatus${person.tone[0].toUpperCase()}${person.tone.slice(1)}`]}`.trim()}>
                    {person.status}
                  </em>
                </div>
              </div>
            </div>
            <button type="button" className={styles.networkAction}>
              View Profile
            </button>
          </article>
        ))}
      </div>
    </section>
  );

  const renderSettingsContent = () => (
    <section className={styles.tabBodyWrap}>
      <div className={styles.settingsGrid}>
        <article className={styles.settingsPanel}>
          <header className={styles.settingsPanelHeader}>
            <div>
              <h4>Application Settings</h4>
              <p>Configure how your AI agent behaves.</p>
            </div>
            <button type="button" className={styles.agentToggle}>
              Agent Status
            </button>
          </header>

          <div className={styles.connectionGrid}>
            {settingsConnections.map((connection) => (
              <div key={connection.name} className={styles.connectionCard}>
                <span className={styles.connectionIcon}>
                  <connection.icon size={15} />
                </span>
                <div>
                  <p>{connection.name}</p>
                  <strong className={styles[`connection${connection.tone[0].toUpperCase()}${connection.tone.slice(1)}`]}>{connection.status}</strong>
                </div>
                <button type="button">Manage Connection</button>
              </div>
            ))}
          </div>

          <p className={styles.settingsSectionLabel}>Flow Controls</p>
          <div className={styles.flowControls}>
            {settingsFlows.map((flow) => (
              <div key={flow.title} className={styles.flowItem}>
                <span>
                  <flow.icon size={14} />
                </span>
                <div>
                  <h5>{flow.title}</h5>
                  <p>{flow.desc}</p>
                </div>
                <span className={`${styles.switchTrack} ${flow.enabled ? styles.switchTrackOn : ""}`.trim()} />
              </div>
            ))}
          </div>
        </article>

        <article className={styles.settingsPanel}>
          <h4>Job Profiles</h4>
          <div className={styles.profileCard}>
            <p>Untitled Profile</p>
            <span>Type: N/A</span>
          </div>
          <div className={styles.profileCardMuted}>Create another specialized profile</div>
          <div className={styles.subscriptionCard}>
            <h5>HireDue Pro</h5>
            <p>You have 14 days left on your billing cycle.</p>
            <strong>$29 /month</strong>
            <button type="button">Manage Subscription</button>
          </div>
        </article>

        <article className={`${styles.settingsPanel} ${styles.settingsPanelWide}`.trim()}>
          <div className={styles.profileTabs}>
            <span className={styles.profileTabActive}>Personal Info</span>
            <span>Education</span>
            <span>External Links</span>
          </div>
          <div className={styles.profileFormGrid}>
            <label>
              <span>Full Name</span>
              <div>test</div>
            </label>
            <label>
              <span>Email Address</span>
              <div>vecar94504@qv</div>
            </label>
            <label>
              <span>Bio / Professional Summary</span>
              <div>e.g. Product Designer with 6+ years of experience...</div>
            </label>
          </div>
        </article>
      </div>
    </section>
  );

  const renderActivePanel = () => {
    if (activeTab === "applications") return renderApplicationsContent();
    if (activeTab === "ats") return renderAtsContent();
    if (activeTab === "network") return renderNetworkContent();
    if (activeTab === "settings") return renderSettingsContent();
    return renderDashboardContent();
  };

  const renderTopbarMeta = () => {
    if (activeTab === "applications") {
      return (
        <div className={styles.topbarMeta}>
          <span className={styles.activeTime}>
            <CalendarCheck2 size={14} /> 24 Active Roles
          </span>
        </div>
      );
    }

    if (activeTab === "ats") {
      return (
        <div className={styles.topbarMeta}>
          <span className={styles.activeTime}>
            <Gauge size={14} /> New Job Hunt Starts in : 00:01:55
          </span>
          <span className={styles.alertBadge}>
            <Bell size={14} />
          </span>
        </div>
      );
    }

    if (activeTab === "network") {
      return (
        <div className={styles.topbarMeta}>
          <span className={styles.activeTime}>
            <Link size={14} /> Live Sync
          </span>
        </div>
      );
    }

    if (activeTab === "settings") {
      return (
        <div className={styles.topbarMeta}>
          <span className={styles.agentStatus}>
            <Shield size={14} /> Preferences Synced
          </span>
        </div>
      );
    }

    return (
      <div className={styles.topbarMeta}>
        <span className={styles.activeTime}>
          <Gauge size={14} /> 12h 45m Active
        </span>
        <span className={styles.agentStatus}>
          <Sparkles size={14} /> Agent Active
        </span>
      </div>
    );
  };

  return (
    <section className={styles.section} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.dashboardFrame}
          style={{
            rotateX,
            y,
            scale,
            opacity,
            transformPerspective: 1400,
          }}
        >
          <div className={styles.dashboardCanvas}>
            <aside className={styles.sidebar}>
              <div className={styles.brandRow}>
                <img src="/assets/HireDue_Text_Logo.png" alt="HireDue" className={styles.brandLogo} />
              </div>
              <nav className={styles.navList}>
                {sidebarTabs
                  .filter((tab) => tab.area === "main")
                  .map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`${styles.navItem} ${activeTab === tab.id ? styles.navItemActive : ""}`.trim()}
                      aria-pressed={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon size={16} /> {tab.label}
                    </button>
                  ))}
              </nav>

              <div className={styles.sidebarBottom}>
                {sidebarTabs
                  .filter((tab) => tab.area === "bottom")
                  .map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={`${styles.navItem} ${activeTab === tab.id ? styles.navItemActive : ""}`.trim()}
                      aria-pressed={activeTab === tab.id}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <tab.icon size={16} /> {tab.label}
                    </button>
                  ))}
                <span className={`${styles.navItem} ${styles.navItemStatic}`.trim()}>
                  <HelpCircle size={16} /> Support
                </span>
                <div className={styles.userBox}>
                  <span className={styles.avatar}>AM</span>
                  <div>
                    <p>Alex Morgan</p>
                    <span>Pro Account</span>
                  </div>
                </div>
              </div>
            </aside>

            <div className={styles.mainPanel}>
              <header className={styles.topbar}>
                <div className={styles.topbarCopy}>
                  <h2>{meta.eyebrow}</h2>
                  <p className={styles.topbarContext}>
                    {activeTab === "dashboard"
                      ? "Live performance view across active automation workflows."
                      : meta.subtitle}
                  </p>
                </div>
                {renderTopbarMeta()}
              </header>

              <motion.div
                key={activeTab}
                className={styles.panelTransition}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              >
                {renderActivePanel()}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardTiltShowcaseSection;
