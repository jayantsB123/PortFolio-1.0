import { Bio, projects, experiences, education } from "../data/constants";

/**
 * Recruitment-facing data.
 * Preserve the original repository as the source for names, dates, screenshots
 * and education. Keep unverified metrics and post-2024 employment out of copy.
 */
const byCode = (fragment) => projects.find((project) => project.github?.includes(fragment));

export const profile = {
  name: Bio.name,
  role: "Software Developer",
  specialty: "Frontend & Full-Stack Development",
  location: "Pune, India",
  github: Bio.github,
  linkedin: Bio.linkedin,
  resume: Bio.resume, // Legacy portfolio link: may not be the current résumé.
  summary:
    "I build responsive React applications, integrate backend services and develop interactive web experiences. My work spans product interfaces, APIs and creative frontend engineering.",
  strengths: ["React interfaces", "Backend integrations", "Interactive web experiences"],
};

export const skillGroups = [
  {
    title: "Frontend",
    summary: "Interfaces and application architecture",
    items: ["React", "JavaScript", "TypeScript", "Next.js", "Redux", "HTML & CSS", "Tailwind CSS", "Material UI"],
  },
  {
    title: "Backend & APIs",
    summary: "Application logic and integrations",
    items: ["Java", "Spring Boot", "Node.js", "Express", "REST APIs"],
  },
  {
    title: "Data & developer tools",
    summary: "Storage, version control and workflows",
    items: ["MongoDB", "PostgreSQL", "MySQL", "Firebase", "Git", "GitHub"],
  },
  {
    title: "Creative frontend",
    summary: "Interaction, motion and 3D graphics",
    items: ["Three.js", "React Three Fiber", "Framer Motion", "Figma"],
  },
];

const selected = [
  {
    slug: "image-lab",
    source: byCode("/AI-Image-Generator"),
    repoUrl: "https://github.com/jayantsB123/AI-Image-Generator",
    name: "AI Image Generator",
    type: "Full-stack web app",
    category: "SYSTEMS",
    index: "01",
    year: "2023",
    tagline: "A prompt-to-image application with a React frontend and Node/Express API.",
    overview: "Built the interface and API flow for generating images from text prompts.",
    problem: "A generative image service needs a usable interface for turning an idea into a request and showing the result.",
    solution: "Connected a React interface to backend routes using Node.js, Express and MongoDB, with an external image-generation API.",
    highlights: [
      "Connected frontend interactions to backend API routes",
      "Implemented prompt submission and generated-image presentation",
      "Structured the application across React, Express and MongoDB",
    ],
    technologies: ["React", "Node.js", "Express", "MongoDB"],
    tone: "orchid",
  },
  {
    slug: "typespeed",
    source: byCode("/TypeSpeed"),
    repoUrl: null, // Original repository link currently returns GitHub 404.
    name: "TypeSpeed",
    type: "React web app",
    category: "INTERFACES",
    index: "02",
    year: "2023–24",
    tagline: "An interactive typing test with configurable practice and performance feedback.",
    overview: "Designed a typing experience with difficulty settings, live performance metrics and saved preferences.",
    problem: "A typing practice tool should show more than typing speed; users need visible accuracy and error information.",
    solution: "Built an interactive test with multiple difficulty modes, adjustable timers, live WPM/KPM/accuracy and local preference persistence.",
    highlights: [
      "Difficulty levels and adjustable practice timers",
      "WPM, KPM, accuracy and error feedback",
      "Pulse and caret modes with preferences stored locally",
    ],
    technologies: ["React", "Material UI", "JavaScript"],
    tone: "ultraviolet",
  },
  {
    slug: "sorting",
    source: byCode("/Dynamic-Sorting-Visualizer"),
    repoUrl: "https://github.com/jayantsB123/Dynamic-Sorting-Visualizer",
    name: "Sorting Visualizer",
    type: "Algorithm visualization",
    category: "EXPERIMENTS",
    index: "03",
    year: "2023",
    tagline: "An interactive way to understand sorting algorithms through animation.",
    overview: "Visualized how sorting operations change arrays, making algorithm behavior easier to follow.",
    problem: "Sorting algorithms are often easier to understand visually than through code alone.",
    solution: "Created an interactive visualization of sorting processes with controllable array states.",
    highlights: [
      "Animated algorithm steps and array state changes",
      "Interactive controls for experimenting with input",
      "A clear visual representation of algorithm behavior",
    ],
    technologies: ["JavaScript", "React", "Algorithms"],
    tone: "chlorophyll",
  },
  {
    slug: "repo-hub",
    source: byCode("/Web-Dev-Assignment"),
    repoUrl: "https://github.com/jayantsB123/Web-Dev-Assignment",
    name: "GITRepoHUB",
    type: "GitHub API interface",
    category: "INTERFACES",
    index: "04",
    year: "2023",
    tagline: "A repository discovery interface powered by the GitHub API.",
    overview: "Built a browsing experience for public repositories with filtering and pagination.",
    problem: "Exploring large sets of repositories requires useful organization, navigation and search constraints.",
    solution: "Integrated public GitHub repository data into a responsive interface with language filtering and pagination.",
    highlights: [
      "GitHub API-driven repository browsing",
      "Language filters and pagination",
      "Responsive layout and theme choices",
    ],
    technologies: ["JavaScript", "GitHub API", "CSS"],
    tone: "sky",
  },
];

export const selectedProjects = selected.filter((project) => Boolean(project.source));
export const categories = ["ALL", "INTERFACES", "SYSTEMS", "EXPERIMENTS"];

const featuredEmployers = [
  "LarvaeSoft Solutions",
  "Mediscient Devices Pvt. Ltd.",
  "ICN India Pvt. Ltd.",
];

const verifiedExperienceDetails = {
  "LarvaeSoft Solutions": {
    bullets: [
      "Developed backend functionality for document-management and notification workflows.",
      "Worked on service responsiveness, security integration and scalable application patterns.",
    ],
    stack: ["Java", "Spring Boot", "React", "Node.js"],
  },
  "Mediscient Devices Pvt. Ltd.": {
    bullets: [
      "Built product, about and individual product pages using React.",
      "Integrated REST APIs with Axios and React Query; fixed UI issues and improved responsive behavior.",
    ],
    stack: ["React", "REST APIs", "Axios", "React Query"],
  },
  "ICN India Pvt. Ltd.": {
    bullets: [
      "Worked on integration between frontend components and backend services for client projects.",
      "Troubleshot application defects and collaborated with cross-functional development teams.",
    ],
    stack: ["React", "Java", "Spring Boot", "Node.js"],
  },
};

export const earlyExperience = experiences
  .filter((item) => featuredEmployers.includes(item.company))
  .map((item) => ({
    role: item.role,
    company: item.company,
    date: item.date,
    ...verifiedExperienceDetails[item.company],
  }));

export const school = education.find((item) =>
  item.school?.includes("Army Institute of Technology")
);

export const quickFacts = [
  {
    label: "FOCUS",
    value: "Frontend + Full-Stack",
    detail: "React interfaces and backend integrations",
    href: "#skills",
  },
  {
    label: "EXPERIENCE",
    value: "3 featured internships",
    detail: "2023–2024 · details below",
    href: "#experience",
  },
  {
    label: "SELECTED PROJECTS",
    value: String(selectedProjects.length) + " featured builds",
    detail: "Full-stack, UI and algorithm work",
    href: "#work",
  },
  {
    label: "EDUCATION",
    value: "B.E. · Computer Science",
    detail: "Army Institute of Technology, Pune · 2025",
    href: "#education",
  },
];
