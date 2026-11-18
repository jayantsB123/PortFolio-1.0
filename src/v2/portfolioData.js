import aiScreenshot from "../images/prjctAI.png";
import typingScreenshot from "../images/typeSpeed.png";
import sortingScreenshot from "../images/prjctSort.png";
import repositoryScreenshot from "../images/gitrepohub.png";

// Historical facts and screenshots are carried forward from src/data/constants.js.
// Import only the four featured assets; importing the entire legacy data module
// bundles every old project image, icon and artwork into the active application.

/**
 * Recruitment-facing data.
 * Preserve the original repository as the source for names, dates, screenshots
 * and education. Keep unverified metrics and post-2024 employment out of copy.
 */


export const profile = {
  name: "Jayant Singh",
  role: "Software Developer",
  specialty: "Frontend & Full-Stack Development",
  location: "Pune, India",
  github: "https://github.com/jayantsB123",
  linkedin: "https://www.linkedin.com/in/jayant-singh-35a66222a/",
  resume: "https://drive.google.com/file/d/1zLMx1gffwbHYzUKeSHrpYff3pTuVH4GD/view?usp=drive_link", // Legacy portfolio link: may not be the current résumé.
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
    source: { image: aiScreenshot },
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
    source: { image: typingScreenshot },
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
    source: { image: sortingScreenshot },
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
    source: { image: repositoryScreenshot },
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

const historicalRoles = [
  { role: "FullStack Developer Intern", company: "LarvaeSoft Solutions", date: "Feb 2024 - April 2024" },
  { role: "Frontend Developer Intern", company: "Mediscient Devices Pvt. Ltd.", date: "Feb 2024 - March 2024" },
  { role: "FullStack Developer Intern", company: "ICN India Pvt. Ltd.", date: "December 2023 - Feb 2024" },
];

export const earlyExperience = historicalRoles.map((item) => ({
  ...item,
  ...verifiedExperienceDetails[item.company],
}));

export const school = {
  school: "Army Institute of Technology, Pune",
  date: "Nov 2021 - Jul 2025",
  degree: "Bachelor of Engineering - BE, Computer Science and Engineering",
  grade: "8.82 CGPA",
};

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
