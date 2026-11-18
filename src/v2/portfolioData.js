import { Bio, projects, experiences, education } from "../data/constants";

// Real student projects and assets are read from the original repository.
// The copy below is intentionally shorter than the original promotional paragraphs.
// Links pointing to google.com in the old data are not treated as live demos.
const byCode = (name) => projects.find((project) => project.github?.includes(name));

const selected = [
  {
    slug: "typespeed", source: byCode("/TypeSpeed"), name: "TypeSpeed",
    category: "INTERFACES", index: "01", year: "2023–24",
    tagline: "A typing test that turns practice into a feedback loop.",
    problem: "Typing speed alone doesn't tell the whole story. Practice is more useful when pace, errors and accuracy are visible together.",
    solution: "An interactive typing workspace with adjustable difficulty, timers, performance breakdowns and two pacing modes.",
    highlights: ["Keystroke-level performance feedback", "Pulse and caret practice modes", "Saved local preferences"],
    technologies: ["React", "Material UI", "JavaScript"], tone: "ultraviolet"
  },
  {
    slug: "sorting", source: byCode("/Dynamic-Sorting-Visualizer"), name: "Sorting, visualized.",
    category: "EXPERIMENTS", index: "02", year: "2023",
    tagline: "An interactive window into the behavior of algorithms.",
    problem: "The steps in an algorithm are easier to understand when they become visible and controllable.",
    solution: "A sorting playground where arrays can be manipulated and algorithms compared visually.",
    highlights: ["Step-by-step algorithm visualization", "Interactive controls", "Algorithmic reasoning made tangible"],
    technologies: ["JavaScript", "React", "Algorithms"], tone: "chlorophyll"
  },
  {
    slug: "image-lab", source: byCode("/AI-Image-Generator"), name: "Prompt → Pixel",
    category: "SYSTEMS", index: "03", year: "2023",
    tagline: "A full-stack experiment at the intersection of creative tooling and AI.",
    problem: "Turning an idea into an AI-generated image requires a clear prompt-to-result workflow.",
    solution: "Built a generative image interface backed by a Node / Express API and MongoDB, connected to an external image service.",
    highlights: ["Frontend-to-backend request flow", "Image generation workflow", "Gallery and content display"],
    technologies: ["React", "Express", "MongoDB"], tone: "orchid"
  },
  {
    slug: "repo-hub", source: byCode("/Web-Dev-Assignment"), name: "GITRepoHUB",
    category: "INTERFACES", index: "04", year: "2023",
    tagline: "Finding signal in the noise of public repositories.",
    problem: "Exploring many repositories shouldn't feel like sifting through an unstructured list.",
    solution: "A GitHub repository explorer with filtering, pagination and theme choices.",
    highlights: ["Public GitHub API integration", "Language filters and pagination", "Responsive browsing interface"],
    technologies: ["JavaScript", "GitHub API", "CSS"], tone: "sky"
  }
];

export const selectedProjects = selected.filter((project) => Boolean(project.source));
export const categories = ["ALL", "INTERFACES", "SYSTEMS", "EXPERIMENTS"];
export const profile = {
  name: Bio.name,
  github: Bio.github,
  linkedin: Bio.linkedin,
  resume: Bio.resume,
  location: "Pune, India",
  role: "Software engineer / creative developer",
};
export const earlyExperience = experiences.filter((item) =>
  ["LarvaeSoft Solutions", "Mediscient Devices Pvt. Ltd.", "ICN India Pvt. Ltd."].includes(item.company)
).map((item) => ({
  role: item.role,
  company: item.company,
  date: item.date,
  summary: item.company === "LarvaeSoft Solutions"
    ? "Backend work on document management, notification services and secure system integration."
    : item.company === "Mediscient Devices Pvt. Ltd."
    ? "React product interfaces, REST API integrations and responsive UI improvements."
    : "Cross-functional frontend and backend integration, debugging and system improvements.",
}));
export const school = education.find((item) => item.school?.includes("Army Institute of Technology"));
