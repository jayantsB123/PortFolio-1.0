import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Keep the checks deterministic and independent from Google Fonts or analytics.
  await page.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/, (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
});

test("shows recruiter information without requiring interaction", async ({ page }) => {
  await expect(page.locator("h1")).toContainText("Software");
  await expect(page.getByRole("heading", { name: "At a glance." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Experience." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Projects & implementation." })).toBeVisible();
  await expect(page.getByRole("heading", { name: "What I work with." })).toBeVisible();
  await expect(page.locator(".v2-project-list-row")).toHaveCount(4);
});

test("project filters stay consistent between list and gallery layouts", async ({ page }) => {
  const filters = page.getByRole("group", { name: "Filter projects" });
  const layouts = page.getByRole("group", { name: "Project layout" });
  await expect(page.locator(".v2-project-list-row")).toHaveCount(4);
  await filters.getByRole("button", { name: /Systems/ }).click();
  await expect(page.locator(".v2-project-list-row")).toHaveCount(1);
  await expect(page.locator(".v2-project-row-name")).toContainText("AI Image Generator");
  await layouts.getByRole("button", { name: /GALLERY/ }).click();
  await expect(page.locator(".v2-project-card")).toHaveCount(1);
  await filters.getByRole("button", { name: /All/ }).click();
  await expect(page.locator(".v2-project-card")).toHaveCount(4);
});

test("project case studies open, trap keyboard focus, and close with Escape", async ({ page }) => {
  await page.locator(".v2-project-row-name").first().click();
  const dialog = page.getByRole("dialog", { name: "AI Image Generator" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("heading", { name: "AI Image Generator" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator(".v2-project-row-name").first()).toBeFocused();
});

test("full-screen navigation supports keyboard dismissal", async ({ page }) => {
  const explore = page.getByRole("button", { name: "Explore sections of the portfolio" });
  await explore.click();
  const dialog = page.getByRole("dialog", { name: "Explore portfolio" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close navigation" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(explore).toBeFocused();
});

test("navigation jumps to projects without hiding content", async ({ page }) => {
  await page.getByRole("button", { name: "Explore sections of the portfolio" }).click();
  const dialog = page.getByRole("dialog", { name: "Explore portfolio" });
  await dialog.getByRole("link", { name: /Projects/ }).click();
  await expect(dialog).not.toBeVisible();
  await expect(page).toHaveURL(/#work$/);
  await expect(page.locator("#work")).toBeVisible();
});

test("page has no accidental horizontal overflow", async ({ page }) => {
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(2);
});

test("reduced-motion mode does not require a WebGL canvas", async ({ page }) => {
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "At a glance." })).toBeVisible();
});


test("active section follows the reader and appears in Explore", async ({ page, isMobile }) => {
  await page.evaluate(() => {
    const section = document.getElementById("experience");
    window.scrollTo({ top: section.offsetTop - 120, behavior: "instant" });
  });
  if (!isMobile) {
    await expect(page.locator(".v2-side-rail a[href='#experience']")).toHaveAttribute("aria-current", "location");
  }
  await page.getByRole("button", { name: "Explore sections of the portfolio" }).click();
  const explore = page.getByRole("dialog", { name: "Explore portfolio" });
  await expect(explore.locator("a[href='#experience']")).toHaveAttribute("aria-current", "location");
  await expect(explore.locator("a.is-current")).toHaveCount(1);
});

test("landing page fills the viewport and shows scroll guidance", async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    hero: document.querySelector("#top").getBoundingClientRect().height,
    window: window.innerHeight,
  }));
  expect(Math.abs(dimensions.hero - dimensions.window)).toBeLessThanOrEqual(3);
  await expect(page.getByRole("link", { name: "Scroll down to portfolio overview" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Section navigation" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Explore sections of the portfolio" })).toBeVisible();
});

test("left rail appears after hero and reverses when scrolling up", async ({ page }) => {
  const rail = page.getByRole("navigation", { name: "Section navigation" });
  await expect(rail).toHaveCount(0);
  await page.locator("#overview").scrollIntoViewIfNeeded();
  await expect(rail).toBeVisible();
  await expect(rail.getByRole("link", { name: "Overview" })).toHaveAttribute("aria-current", "location");
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(rail).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Explore sections of the portfolio" })).toBeVisible();
});

test("heading and chapter treatments keep information readable", async ({ page }) => {
  await page.locator("#experience").scrollIntoViewIfNeeded();
  const heading = page.getByRole("heading", { name: "Experience." });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveCSS("opacity", "1");
  await page.locator("#work").scrollIntoViewIfNeeded();
  await page.locator("#experience").scrollIntoViewIfNeeded();
  await expect(heading).toBeVisible();
});
