import test from "node:test";
import assert from "node:assert/strict";
import {
  achievementsContent, categories, earlyExperience, heroContent,
  navigationContent, overviewEducation, primaryExperience, profile,
  quickFacts, school, selectedProjects, skillGroups, supportingProjects,
  projectContent, aboutContent, philosophyContent, loaderContent, resumeContent,
} from "../src/v2/portfolioData.js";
import { countByCategory, filterProjects } from "../src/v2/projectView.js";

test("professional identity and 2026 links are the source of truth", () => {
  assert.equal(profile.fullName, "Jayant Singh Bhadauria");
  assert.equal(profile.role, "Software Development Engineer");
  assert.equal(profile.employer, "Sarvatra Technologies");
  assert.match(profile.specialty, /Backend Engineering/);
  assert.match(heroContent.summary, /Digital Rupee/);
  assert.match(profile.resume, /1igz5xhAoM-RMV8uaABzgK6fhWDeNdutO/);
  assert.equal(profile.publicEmail, null);
});

test("employment order and publication-safe achievements", () => {
  assert.deepEqual(primaryExperience.map((job) => job.id), [
    "sarvatra-sde", "sarvatra-intern",
  ]);
  assert.equal(primaryExperience[0].initiallyVisibleBullets, 4);
  assert.equal(primaryExperience[0].bullets.length, 10);
  assert.equal(primaryExperience[1].bullets.length, 2);
  assert.equal(earlyExperience.length, 3);
  assert.match(primaryExperience[0].bullets[3], /in UAT/);
  assert.equal(school.grade, "8.95 CGPA");
  assert.equal(overviewEducation.grade, school.grade);
});

test("featured projects and categories reflect the current backend focus", () => {
  assert.deepEqual(categories, ["ALL", "SYSTEMS", "BACKEND", "EXPERIMENTS"]);
  assert.deepEqual(selectedProjects.map((p) => p.slug), [
    "sentinel-ledger", "cbdc-reconciliation", "pcbdc-redemption", "offline-cbdc",
  ]);
  assert.equal(selectedProjects.filter((p) => p.repoUrl === null).length, 3);
  assert.equal(selectedProjects[0].repoUrl, "https://github.com/jayantsB123/Sentinel-Ledger");
  assert.equal(countByCategory(selectedProjects, "SYSTEMS"), 2);
  assert.equal(filterProjects(selectedProjects, "BACKEND").length, 1);
  assert.equal(filterProjects(selectedProjects, "EXPERIMENTS").length, 1);
  assert.equal(projectContent.toolbar, "SELECTED WORK / 2025—2026");
  assert.equal(supportingProjects.length, 3);
  assert(supportingProjects.some((p) => p.name === "RegisterRover"));
});

test("navigation and all page sections are internally consistent", () => {
  assert.equal(quickFacts[3].href, "#achievements");
  assert.equal(achievementsContent.entries.length, 6);
  assert.equal(skillGroups.length, 4);
  assert.equal(navigationContent.routes.length, 6);
  assert.match(aboutContent.paragraphs[0], /reconciliation problem/);
  assert.match(philosophyContent.paragraph, /mostly correct/);
  assert.equal(loaderContent.frameSubtitle, "ENGINEERING PAYMENTS AT SCALE");
});

test("all resume placements use the verified owner-provided destination and clear labels", () => {
  assert.equal(
    profile.resume,
    "https://drive.google.com/file/d/1igz5xhAoM-RMV8uaABzgK6fhWDeNdutO/view?usp=sharing"
  );
  assert.match(resumeContent.accessibleLabel, /opens in a new tab/);
  assert.match(resumeContent.destination, /GOOGLE DRIVE/);
  assert.match(resumeContent.heroLabel, /RÉSUMÉ/);
  assert.match(resumeContent.action, /OPEN RÉSUMÉ/);
});
