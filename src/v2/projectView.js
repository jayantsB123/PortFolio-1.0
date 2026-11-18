/**
 * Keep view-specific project logic separate from React components.
 * Pure functions make the filtering behavior easy to test.
 */
export const VIEW_MODES = Object.freeze(["list", "gallery"]);

export function filterProjects(projects, category) {
  if (category === "ALL") return projects;
  return projects.filter((project) => project.category === category);
}

export function countByCategory(projects, category) {
  return filterProjects(projects, category).length;
}

export function projectAccessibleName(project) {
  return project.name + " — " + project.type;
}
