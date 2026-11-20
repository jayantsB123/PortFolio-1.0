import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// These checks deliberately override the suite's default reduced-motion setting
// so the animation is actually mounted and tested.
test.use({ reducedMotion: "no-preference" });

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/, (route) => route.abort());
});

test("default intro is skippable and restores the full portfolio", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const intro = page.getByRole("dialog", { name: "Portfolio introduction" });
  await expect(intro).toBeVisible();
  await expect(intro).toHaveAttribute("data-loader-mode", /^(system|type|ignition|commit)$/);
  await expect(intro.getByRole("button", { name: /Skip intro/i })).toBeVisible();
  await expect(intro.getByRole("button", { name: /Skip intro/i })).toHaveCSS("cursor", "pointer");
  await expect(page.locator(".v2-root > main")).toHaveAttribute("inert", "");
  await intro.getByRole("button", { name: /Skip intro/i }).click();
  await expect(intro).toHaveCount(0);
  await expect(page.locator(".v2-root > main")).not.toHaveAttribute("inert", "");
  await expect(page.getByRole("heading", { name: /Backend.*engineer/i })).toBeVisible();
  await page.locator("#top").getByRole("link", { name: /EXPLORE MY WORK/i }).click();
  await expect(page).toHaveURL(/#work$/);
});

test("finishes on its own without pretending to load network assets", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const intro = page.getByRole("dialog", { name: "Portfolio introduction" });
  await expect(intro).toBeVisible();
  // Allow the longest permitted configured sequence: four 4-second phases + exit.
  await expect(intro).toHaveCount(0, { timeout: 18000 });
  await expect(page.getByRole("link", { name: "Scroll to explore the portfolio overview" })).toBeVisible();
  await expect(page.locator(".v2-landing-header")).toHaveCount(0);
});

test("intro appears only once per browser tab across reloads", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const intro = page.getByRole("dialog", { name: "Portfolio introduction" });
  await expect(intro).toBeVisible();
  await intro.getByRole("button", { name: /Skip intro/i }).click();
  await expect(intro).toHaveCount(0);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(intro).toHaveCount(0);
});

test("Escape dismisses the intro and page stays keyboard navigable", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const intro = page.getByRole("dialog", { name: "Portfolio introduction" });
  await expect(intro).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(intro).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Skip to career overview" })).toBeFocused();
});

test("intro keeps its layout on desktop and touch devices", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const intro = page.getByRole("dialog", { name: "Portfolio introduction" });
  await expect(intro).toBeVisible();
  const dimensions = await intro.evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    viewportWidth: document.documentElement.clientWidth,
    horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  expect(Math.abs(dimensions.width - dimensions.viewportWidth)).toBeLessThanOrEqual(2);
  expect(dimensions.horizontalOverflow).toBeLessThanOrEqual(2);
  await intro.getByRole("button", { name: /Skip intro/i }).click();
  await expect(intro).toHaveCount(0);
});

test("intro has no serious accessibility violations", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const intro = page.getByRole("dialog", { name: "Portfolio introduction" });
  await expect(intro).toBeVisible();
  const results = await new AxeBuilder({ page })
    .include(".v2-intro-overlay")
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  const violations = results.violations.filter((issue) =>
    issue.impact === "serious" || issue.impact === "critical"
  );
  expect(violations.map(({ id, nodes }) => ({
    id,
    elements: nodes.map(({ target }) => target),
  }))).toEqual([]);
});
