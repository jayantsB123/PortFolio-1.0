import test from "node:test";
import assert from "node:assert/strict";
import { filterProjects, countByCategory, projectAccessibleName, VIEW_MODES } from "../src/v2/projectView.js";

const sample = [
  { name: "A", type: "React web app", category: "INTERFACES" },
  { name: "B", type: "API", category: "SYSTEMS" },
  { name: "C", type: "Algorithms", category: "EXPERIMENTS" },
  { name: "D", type: "React web app", category: "INTERFACES" },
];

test("ALL returns every project without changing source order", () => {
  assert.deepEqual(filterProjects(sample, "ALL"), sample);
});
test("filterProjects selects the requested category and retains order", () => {
  assert.deepEqual(filterProjects(sample, "INTERFACES").map((p) => p.name), ["A", "D"]);
  assert.deepEqual(filterProjects(sample, "SYSTEMS").map((p) => p.name), ["B"]);
});
test("countByCategory stays in sync with filtering", () => {
  for (const category of ["ALL", "INTERFACES", "SYSTEMS", "EXPERIMENTS", "OTHER"]) {
    assert.equal(countByCategory(sample, category), filterProjects(sample, category).length);
  }
});
test("projectAccessibleName communicates type as well as name", () => {
  assert.equal(projectAccessibleName(sample[0]), "A — React web app");
});
test("both available project layouts are predictable", () => {
  assert.deepEqual(VIEW_MODES, ["list", "gallery"]);
});
