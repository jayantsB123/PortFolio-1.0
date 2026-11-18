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
