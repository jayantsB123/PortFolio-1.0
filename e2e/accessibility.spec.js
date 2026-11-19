import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/, (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
});

test("career overview and projects have no serious accessibility violations", async ({ page }) => {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  const problems = results.violations
    .filter((violation) => violation.impact === "serious" || violation.impact === "critical")
    .map(({ id, impact, nodes }) => ({
      id,
      impact,
      elements: nodes.slice(0, 6).map(({ target, failureSummary }) => ({
        target,
        issue: failureSummary,
      })),
    }));

  expect(problems).toEqual([]);
});

test("full-screen section menu has no serious accessibility violations", async ({ page }) => {
  await page.getByRole("button", { name: "Explore sections of the portfolio" }).click();
  const results = await new AxeBuilder({ page })
    .include(".v2-quicknav")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const problems = results.violations.filter((v) => ["serious", "critical"].includes(v.impact));
  expect(problems.map((v) => ({ id: v.id, elements: v.nodes.map((n) => n.target) }))).toEqual([]);
});
