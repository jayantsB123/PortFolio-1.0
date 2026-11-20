/**
 * PORTFOLIO CONTENT — 20 November 2026
 *
 * This is the single editorial source of truth for displayed information.
 * The sections below map directly to website anchors and components.
 * All professional claims/copy come from the owner's final content brief.
 *
 * Visual assets, 3D interactions, loaders, motion and site configuration
 * intentionally live elsewhere. The source of truth for their *words* is here.
 */

// ────────────────────────────────────────────────────────────────────────────
// 01  IDENTITY & POSITIONING — hero, overview, navigation, metadata, footer
// ────────────────────────────────────────────────────────────────────────────
export const profile = {
  fullName: "Jayant Singh Bhadauria",
  name: "Jayant Singh",
  role: "Software Development Engineer",
  specialty: "Backend Engineering · FinTech · Distributed Systems",
  location: "Pune, India",
  employer: "Sarvatra Technologies",
  employmentSince: "July 2025",
  domain: "Fintech and payment infrastructure",
  github: "https://github.com/jayantsB123",
  linkedin: "https://www.linkedin.com/in/jayant-singh-35a66222a/",
  resume: "https://drive.google.com/file/d/1igz5xhAoM-RMV8uaABzgK6fhWDeNdutO/view?usp=sharing",
  publicEmail: null,
  targetRoles: ["Backend Engineer", "Software Engineer", "Java Developer", "FinTech Engineer", "SDE"],
  summary:
    "I'm a Software Development Engineer, building backend systems for fintech and digital payment infrastructure. I engineer the payment infrastructure behind India's Digital Rupee: reconciliation, programmable money and offline payments running in production across ICICI, PNB and SBI. I build systems that stay correct under concurrency, retries and failure, because in payments, almost right is still wrong.",
  strengths: [
    "Production fintech engineering",
    "Distributed systems and concurrency",
    "Transaction correctness",
    "Performance and resilience",
    "Security-minded implementation",
  ],
};

// ────────────────────────────────────────────────────────────────────────────
// 01B RÉSUMÉ — Hero shortcut, overview document card, education link
//     All three link variants use profile.resume; no extra click or gated modal.
// ────────────────────────────────────────────────────────────────────────────
export const resumeContent = {
  eyebrow: "CAREER DOCUMENT / 01",
  label: "RÉSUMÉ",
  heroLabel: "VIEW RÉSUMÉ",
  title: "The résumé.",
  description: "Engineering experience, production systems, technical depth and the work behind them.",
  meta: "SOFTWARE DEVELOPMENT ENGINEER · BACKEND / FINTECH",
  destination: "GOOGLE DRIVE · OPENS IN NEW TAB",
  action: "OPEN RÉSUMÉ",
  inlineLabel: "VIEW FULL RÉSUMÉ",
  accessibleLabel: "View résumé in Google Drive (opens in a new tab)",
};

// ────────────────────────────────────────────────────────────────────────────
// 02  HERO  #top — RecruiterHero
// ────────────────────────────────────────────────────────────────────────────
export const heroContent = {
  kicker: "JAYANT SINGH",
  headingLine1: "Backend",
  headingLine2: "engineer",
  specialty: profile.specialty,
  summary: profile.summary,
  primaryCta: "EXPLORE MY WORK ↗",
  primaryHref: "#work",
  secondaryCta: "PROFESSIONAL EXPERIENCE ↓",
  secondaryHref: "#experience",
  scrollCue: "SCROLL TO EXPLORE",
  scrollHref: "#overview",
  // The green 3D engine's controls and legend are not changing.
};

// ────────────────────────────────────────────────────────────────────────────
// 03  OVERVIEW  #overview — RecruiterOverview
// ────────────────────────────────────────────────────────────────────────────
export const overviewContent = {
  eyebrow: "THE SHORT VERSION",
  heading: "Engineering that holds up in production.",
  intro:
    "A look at the systems I build, the problems I solve and the engineering principles behind the work.",
  links: {
    github: "GITHUB PROFILE ↗",
    linkedin: "LINKEDIN PROFILE ↗",
  },
};
export const quickFacts = [
  {
    label: "FOCUS",
    value: "Backend & Distributed Systems",
    detail: "Java · FinTech · Payment Infrastructure",
    href: "#skills",
  },
  {
    label: "EXPERIENCE",
    value: "Sarvatra Technologies",
    detail: "Software Development Engineer · Jul 2025–Present",
    href: "#experience",
  },
  {
    label: "SELECTED WORK",
    value: "Production Systems + Engineering Projects",
    detail: "CBDC · Reconciliation · Distributed Workflows",
    href: "#work",
  },
  {
    label: "RECOGNITION",
    value: "2nd Nationally · RBI Harbinger 2025",
    detail: "Offline CBDC payments challenge",
    href: "#achievements",
  },
];
export const overviewEducation = {
  label: "EDUCATION",
  summary: "B.E. Computer Engineering",
  institution: "Army Institute of Technology, Pune",
  grade: "8.95 CGPA",
  year: "2025",
  href: "#education",
};

// ────────────────────────────────────────────────────────────────────────────
// 04  EXPERIENCE  #experience — primary expanded + secondary compact timeline
// ────────────────────────────────────────────────────────────────────────────
export const experienceContent = {
  eyebrow: "PROFESSIONAL EXPERIENCE",
  heading: "Building systems that move money.",
  intro:
    "I work on backend engineering for digital payment infrastructure, with a focus on transaction correctness, resilient distributed workflows and production reliability.",
  showMore: "SHOW MORE WORK ↓",
  showLess: "SHOW LESS ↑",
  earlyLabel: "EARLIER EXPERIENCE",
};
export const primaryExperience = [
  {
    id: "sarvatra-sde",
    company: "Sarvatra Technologies",
    role: "Software Development Engineer",
    employmentType: "Full-time",
    location: "Pune · on-site",
    date: "Jul 2025 – Present",
    initiallyVisibleBullets: 4,
    bullets: [
      "Engineered the reconciliation engine at the core of CBDC payment-failure recovery, live in production across ICICI, PNB and SBI and resolving failed transactions across 4 fund-recovery paths under RBI/NPCI settlement rules.",
      "Extended that architecture to power offline CBDC payments for RBI Harbinger 2025: 2nd place nationally, formally acknowledged by RBI, with interest from PNB and Indus. Selected as Sarvatra's flagship showcase for Global Fintech Fest 2026.",
      "Built the programmable-token (PCBDC) expiry and redemption engine: live at ICICI, in UAT rollout across SBI, PNB, IDFC, IDBI, Indus and CBI, and Sarvatra's winning showcase at Global Fintech Fest 2025.",
      "Re-engineered redemption SQL and concurrency handling to sustain ICICI's live 100M+ token base, validating 100,000+ redemptions/hour under multi-node load in UAT.",
      "Architected a fault-tolerant, multi-node Aadhaar-based wallet onboarding pipeline (distributed locking, retry-safe idempotent processing, compensating rollbacks) for exactly-once provisioning across a 13M+ user rollout.",
      "Designed an event-driven Kafka wallet-blocking service for ICICI that resolves race conditions across simultaneous multi-node block requests, closing a latency gap in real-time fraud response.",
      "Implemented hybrid AES-256/RSA encryption for sensitive payloads in the SMS-gateway pipeline, in production for ICICI and PNB's PMGKAY disbursement scheme.",
      "Took over development ownership of the PNB Unified Layer.",
      "Closed a reported OTP-validation gap by adding server-side eligibility checks across four transaction flows.",
      "Built external-facing APIs so expense-management providers can run corporate programmable-money workflows (sponsor setup, rules, disbursement, balances).",
    ],
    stack: [
      "Java (8/11/17)", "Spring Boot", "Hibernate/JPA", "jPOS",
      "REST APIs", "Oracle SQL", "Kafka", "Redis", "RabbitMQ",
      "Distributed locking", "Multithreading", "Idempotency",
      "Docker", "Gradle", "Flyway", "JUnit", "Mockito", "ELK",
    ],
  },
  {
    id: "sarvatra-intern",
    company: "Sarvatra Technologies",
    role: "Software Developer Intern",
    employmentType: "Internship · converted to full-time",
    location: "Pune · on-site",
    date: "Jan 2025 – Jun 2025",
    bullets: [
      "Designed and shipped a centralized log observability stack (Docker, Elasticsearch, Logstash, Kibana) for production payment infrastructure, cutting diagnosis time on critical CBDC transaction logs.",
      "Designed the Account-Check verification module for pre-transaction bank account validation, adding new failure-mode result codes now embedded in the primary payment channel.",
    ],
    stack: ["Docker", "Elasticsearch", "Logstash", "Kibana", "Java", "jPOS"],
  },
];
export const earlyExperience = [
  {
    id: "larvaesoft",
    company: "LarvaeSoft Solutions",
    role: "FullStack Developer Intern",
    date: "Feb 2024 – Apr 2024",
    summary: "Built backend functionality for a document-management system and notification workflows.",
    stack: ["Java", "Spring Boot", "React", "Node.js"],
  },
  {
    id: "mediscient",
    company: "Mediscient Devices Pvt. Ltd.",
    role: "Frontend Developer Intern",
    date: "Feb 2024 – Mar 2024",
    summary:
      "Built React product and about pages, integrated REST APIs with Axios and React Query, and improved responsive UI behavior.",
    stack: ["React", "REST APIs", "Axios", "React Query"],
  },
  {
    id: "icn-india",
    company: "ICN India Pvt. Ltd.",
    role: "FullStack Developer Intern",
    date: "Dec 2023 – Feb 2024",
    summary: "Integrated frontend components with backend services and troubleshot application defects.",
    stack: ["React", "Java", "Spring Boot", "Node.js"],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// 05  EDUCATION  #education — row at the end of the Experience section
// ────────────────────────────────────────────────────────────────────────────
export const school = {
  school: "Army Institute of Technology, Pune",
  date: "2021 – 2025",
  degree: "Bachelor of Engineering, Computer Engineering",
  grade: "8.95 CGPA",
};

// ────────────────────────────────────────────────────────────────────────────
// 06  PROJECTS  #work — ProjectExplorer, category filters, case-study modal
// ────────────────────────────────────────────────────────────────────────────
export const projectContent = {
  eyebrow: "SELECTED ENGINEERING WORK",
  heading: "Systems, not just features.",
  intro:
    "A selection of backend systems and independent builds focused on correctness, reliability, performance and thoughtful engineering.",
  toolbar: "SELECTED WORK / 2025—2026",
  bottomTagline: "DESIGNED FOR CORRECTNESS. BUILT FOR REAL WORKLOADS.",
  bottomLink: "MORE ON GITHUB ↗",
  supportingHeading: "Additional builds",
  supportingIntro: "Other projects and ongoing experiments.",
};

export const selectedProjects = [
  {
    slug: "sentinel-ledger",
    name: "Sentinel-Ledger",
    type: "Payment gateway · Personal project",
    category: "SYSTEMS",
    index: "01",
    year: "2026",
    tone: "chlorophyll",
    source: { image: null },
    repoUrl: "https://github.com/jayantsB123/Sentinel-Ledger",
    tagline: "An idempotent payment gateway engineered to process every payment exactly once, even under concurrent load.",
    overview: "An idempotent payment gateway with a double-entry ledger, reconciliation and resilient concurrency controls.",
    problem:
      "Networks retry, clients double-click and nodes race. A payment API that isn't idempotent will eventually move the same money twice.",
    solution:
      "Three layers of defence: a Redis cache-aside fast path, distributed locking to serialize concurrent duplicates, and a PostgreSQL unique-constraint backstop with SHA-256 request fingerprinting, so correctness never depends on cache state alone.",
    highlights: [
      "Double-entry bookkeeping ledger with multi-layer idempotency",
      "Redis-backed rate limiting",
      "Reconciliation service to detect and resolve ledger discrepancies",
      "PII masking for PANs and account numbers in logs",
    ],
    technologies: ["Java", "Spring Boot", "PostgreSQL", "Redis", "Flyway", "Gradle"],
    roadmap: ["Outbox pattern", "Circuit breaker", "Observability", "Kubernetes"],
    artLabel: "IDEMPOTENT / LEDGER / RECONCILE",
    confidentiality: null,
  },
  {
    slug: "cbdc-reconciliation",
    name: "CBDC Payment-Failure Reconciliation Engine",
    type: "Fintech backend · Production system",
    category: "SYSTEMS",
    index: "02",
    year: "2025",
    tone: "sky",
    source: { image: null },
    repoUrl: null,
    confidentiality: "Work project · source not public",
    tagline: "The recovery engine that finds failed digital-rupee transactions and puts the money where it belongs.",
    overview: "Payment-failure recovery across four settlement paths, running in production across ICICI, PNB and SBI.",
    problem:
      "In a multi-party payment, a transaction can fail after money has moved on one side. Each case must be resolved correctly under RBI/NPCI settlement rules, with no loss and no double-credit.",
    solution:
      "Modeled failure recovery as four distinct fund-recovery paths, each with its own rules and outcome, driven by a reconciliation engine that identifies the path and resolves it deterministically.",
    highlights: [
      "Reconciliation core for failed CBDC payment flows",
      "Four distinct fund-recovery paths",
      "Production rollout across ICICI, PNB and SBI",
    ],
    technologies: ["Java", "jPOS (Q2)", "Oracle/PostgreSQL", "Kafka"],
    artLabel: "FAILURE → RECOVERY / CBDC",
  },
  {
    slug: "pcbdc-redemption",
    name: "Programmable CBDC Expiry and Redemption Engine",
    type: "Fintech backend · Production system",
    category: "BACKEND",
    index: "03",
    year: "2025",
    tone: "orchid",
    source: { image: null },
    repoUrl: null,
    confidentiality: "Work project · source not public",
    tagline: "Programmable money that expires, redeems and scales: 100M+ tokens, 100,000+ redemptions an hour.",
    overview:
      "Expiry and redemption processing for a 100M+ live token base, validated at 100,000+ redemptions/hour in UAT.",
    problem:
      "With a token base above 100 million, expiry and redemption jobs hit the database hard, and concurrent multi-node processing risks double-redemptions and slowdowns.",
    solution:
      "Profiled the redemption path, re-engineered the core SQL, and redesigned concurrency handling for multi-node execution. Validated in UAT at 100,000+ redemptions per hour.",
    highlights: [
      "Optimized redemption SQL and concurrent multi-node processing",
      "Live at ICICI; in UAT across SBI, PNB, IDFC, IDBI, Indus and CBI",
      "Sarvatra's winning showcase at Global Fintech Fest 2025",
    ],
    technologies: ["Java", "jPOS (Q2)", "Oracle", "SQL optimization", "Multithreading"],
    artLabel: "100M+ TOKENS / MULTI-NODE",
  },
  {
    slug: "offline-cbdc",
    name: "Offline CBDC Payments — RBI Harbinger 2025",
    type: "Fintech innovation · Work project",
    category: "EXPERIMENTS",
    index: "04",
    year: "2025",
    tone: "ultraviolet",
    source: { image: null },
    repoUrl: null,
    confidentiality: "Work project · source not public",
    tagline: "Digital rupee payments with no internet: 2nd place in the Reserve Bank of India's flagship hackathon.",
    overview:
      "Offline CBDC payments built on reconciliation architecture; 2nd nationally at RBI Harbinger 2025.",
    problem:
      "Offline payments settle later, so they must be reconciled safely once devices reconnect.",
    solution:
      "Reused the reconciliation engine's recovery model so offline transactions settle correctly when connectivity returns.",
    highlights: [
      "Extended reconciliation architecture for offline CBDC payments",
      "2nd place nationally at RBI Harbinger 2025, with formal RBI acknowledgment",
      "Selected as Sarvatra's flagship showcase for Global Fintech Fest 2026",
    ],
    technologies: ["CBDC", "Offline payments", "Reconciliation", "Digital payments"],
    artLabel: "OFFLINE / RECONNECT / SETTLE",
  },
];

export const categories = ["ALL", "SYSTEMS", "BACKEND", "EXPERIMENTS"];

export const supportingProjects = [
  {
    name: "Multimodal Deepfake Detection",
    year: "2025",
    status: "Research project",
    description: "Video deepfake classification using a ResNeXt + LSTM pipeline and Django web app.",
    technologies: ["ResNeXt", "LSTM", "Django"],
    repoUrl: null,
  },
  {
    name: "PII / Secret-Leakage Scanner",
    year: "In progress",
    status: "Ongoing",
    description:
      "Scanner for logs and commit diffs tuned to payment data, including PANs, account numbers and OTPs.",
    technologies: ["Data security", "Log analysis"],
    repoUrl: null,
  },
  {
    name: "RegisterRover",
    year: "Independent project",
    status: "AI-powered attendance",
    description:
      "An attendance system that detects faces in a camera frame, matches enrolled students and records attendance in the database.",
    technologies: ["Face detection", "Attendance automation"],
    repoUrl: "https://github.com/jayantsB123/RegisterRover",
  },
];

// ────────────────────────────────────────────────────────────────────────────
// 07  SKILLS  #skills — RecruiterSkills
// ────────────────────────────────────────────────────────────────────────────
export const skillsContent = {
  eyebrow: "TECHNICAL SKILLS",
  heading: "What I work with.",
  intro: "The stack behind production payment systems: backend architecture, concurrency, messaging, data and delivery.",
  disclaimer:
    "Technologies used in production payment systems, personal projects and competitive programming.",
};
export const skillGroups = [
  {
    title: "Backend and architecture",
    summary: "Payment services and system design",
    items: [
      "Java (8/11/17)", "Spring Boot", "Hibernate/JPA",
      "jPOS (Q2, TransactionManager, Space)", "RESTful APIs",
      "Microservices", "Event-Driven Architecture",
    ],
  },
  {
    title: "Concurrency and resilience",
    summary: "Correctness under load and failure",
    items: [
      "Multithreading (ExecutorFramework)", "Distributed Locking", "Idempotency",
      "Fault Tolerance", "Distributed Systems Design",
    ],
  },
  {
    title: "Messaging, data and infrastructure",
    summary: "Moving, storing and shipping data",
    items: [
      "Kafka", "RabbitMQ", "Redis", "Oracle", "PostgreSQL", "MySQL",
      "SQL Optimization", "Docker", "Kubernetes", "Flyway",
      "Gradle", "Git/GitHub",
    ],
  },
  {
    title: "Quality and more",
    summary: "Testing, security and breadth",
    items: [
      "JUnit", "Mockito", "Secure Coding (AES-256/RSA)", "C++",
      "Python", "JavaScript", "React", "Angular", "DSA",
    ],
  },
];

// ────────────────────────────────────────────────────────────────────────────
// 08  ABOUT  #about — AboutFooter
// ────────────────────────────────────────────────────────────────────────────
export const aboutContent = {
  asideEyebrow: "THE PERSON BEHIND THE SYSTEMS",
  artworkCaption: ["ALWAYS", "IN THE MAKING."],
  eyebrow: "BEYOND THE COMMIT HISTORY",
  headingLine1: "Curiosity, with",
  headingLine2: "a systems mindset.",
  paragraphs: [
    "I build the backend systems that move money, where a retried request, a race condition or a missed edge case isn't a bug report, it's a reconciliation problem. I like that kind of pressure: the work is exacting, the failure modes are unforgiving, and getting it right quietly matters to millions of people.",
    "Away from the keyboard I'm usually lifting, running, grinding Codeforces, or planning the next trek or long motorcycle ride.",
  ],
  descriptor: "ENGINEER / RIDER / CURIOUS HUMAN",
};

// ────────────────────────────────────────────────────────────────────────────
// 09  ENGINEERING PHILOSOPHY — ArchitectureInterlude
// ────────────────────────────────────────────────────────────────────────────
export const philosophyContent = {
  label: "THE APPROACH / 001",
  headingLine1: "Think in",
  headingLine2: "systems",
  paragraph:
    'In payments, "mostly correct" is a bug. Every retry is a risk, every race is real money, and every design has to hold at 3 a.m. under load.',
  steps: [
    { number: "01", label: "UNDERSTAND", statement: "Start with how it fails." },
    { number: "02", label: "DESIGN", statement: "Make correctness structural, not hopeful." },
    { number: "03", label: "SHIP", statement: "Prove it under load, then trust it." },
  ],
  caption: "SIMPLICITY IS HARD-WON.",
};

// ────────────────────────────────────────────────────────────────────────────
// 10  CONTACT  #contact — Footer
// ────────────────────────────────────────────────────────────────────────────
export const contactContent = {
  eyebrow: "CONNECT",
  rightLabel: "GOT SOMETHING GOOD IN MIND?",
  headingLine1: "Have a role",
  headingLine2: "or project?",
  cta: "CONNECT ON LINKEDIN",
  footerLinks: {
    github: "GITHUB ↗",
    linkedin: "LINKEDIN ↗",
    backToTop: "BACK TO TOP ↑",
  },
};

// ────────────────────────────────────────────────────────────────────────────
// 11  NAVIGATION — side rail + QuickNav full-screen dialog
// ────────────────────────────────────────────────────────────────────────────
export const navigationContent = {
  introLabel: "JAYANT / SOFTWARE ENGINEER",
  introPrompt: "Find what you're looking for.",
  routes: [
    ["01", "Overview", "#overview", "The quick introduction", "⌁"],
    ["02", "Experience", "#experience", "Roles and responsibilities", "▤"],
    ["03", "Projects", "#work", "Systems in production", "⌘"],
    ["04", "Skills", "#skills", "Technical toolkit", "✳"],
    ["05", "About", "#about", "Beyond the code", "◈"],
    ["06", "Contact", "#contact", "Get in touch", "↗"],
  ],
  footerSlogan: "BUILD THOUGHTFULLY. SHIP CONFIDENTLY.",
};

// ────────────────────────────────────────────────────────────────────────────
// 12  LOADER TEXT — visual styles/behavior remain controlled by setenv.js
// ────────────────────────────────────────────────────────────────────────────
export const loaderContent = {
  frameCode: "J / 26",
  frameSubtitle: "ENGINEERING PAYMENTS AT SCALE",
  bootFooter: "SYSTEMS ENGINEERING",
  ignitionEyebrow: "PAYMENT SYSTEMS / 001",
  footerMark: "JAYANT SINGH © 2026",
};

// ────────────────────────────────────────────────────────────────────────────
// 13  ACHIEVEMENTS  #achievements — within/after Experience
// ────────────────────────────────────────────────────────────────────────────
export const achievementsContent = {
  eyebrow: "RECOGNITION & ACHIEVEMENTS",
  heading: "Proven beyond the code.",
  intro: "Recognition in fintech innovation, hackathons and competitive programming.",
  entries: [
    {
      title: "RBI Harbinger 2025",
      result: "2nd place nationally",
      detail: "Reserve Bank of India's flagship hackathon for offline payments.",
    },
    {
      title: "Global Fintech Fest 2025 / 2026",
      result: "Sarvatra showcases",
      detail:
        "Winning showcase in 2025 for programmable CBDC; selected flagship for the 2026 offline CBDC showcase.",
    },
    {
      title: "MLH Fellowship",
      result: "Selected · Top 100 in Asia",
      detail: "Selected among the top 100 students across Asia.",
    },
    {
      title: "Tally CodeBrewers 2023",
      result: "Top 10 / 12,200+ teams",
      detail: "National hackathon.",
    },
    {
      title: "INNERVE 6.0",
      result: "Finalist · Top 5",
      detail: "Top 5 among 85,000+ registrations.",
    },
    {
      title: "Codeforces & LeetCode",
      result: "Specialist · peak 1576",
      detail: "1,000+ problems solved across Codeforces and LeetCode.",
    },
  ],
};
