import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/, (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
});

const driveId = "1igz5xhAoM-RMV8uaABzgK6fhWDeNdutO";

test("resume is immediately discoverable in the hero without replacing its two original CTAs", async ({ page }) => {
  const hero = page.locator("#top");
  await expect(hero.getByRole("link", { name: /EXPLORE MY WORK/i })).toBeVisible();
  await expect(hero.getByRole("link", { name: /PROFESSIONAL EXPERIENCE/i })).toBeVisible();
  const link = hero.getByRole("link", { name: /VIEW RÉSUMÉ/i });
  await expect(link).toBeVisible();
  await expect(link).toContainText("VIEW RÉSUMÉ");
  await expect(link).toContainText("OPENS IN NEW TAB");
  await expect(link).toHaveAttribute("href", new RegExp(driveId));
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", /noopener/);
  await expect(page.locator("#top .v2-hero-resume")).toHaveCount(1);
});

test("overview presents a designer-style document pass with one-click access", async ({ page }) => {
  const pass = page.locator("#overview .v2-resume-pass");
  await pass.scrollIntoViewIfNeeded();
  await expect(pass).toBeVisible();
  await expect(pass).toHaveAccessibleName(/The résumé\./);
  await expect(pass).toContainText("The résumé.");
  await expect(pass).toContainText("OPEN RÉSUMÉ");
  await expect(pass).toContainText("GOOGLE DRIVE · OPENS IN NEW TAB");
  await expect(pass).toHaveAttribute("href", new RegExp(driveId));
  await expect(pass).toHaveAttribute("target", "_blank");
  await expect(pass.locator("svg")).toHaveAttribute("aria-hidden", "true");
  await expect(pass.locator(".v2-resume-action-arrow")).toHaveAttribute("aria-hidden", "true");
});

test("all three accessible resume links share the same URL", async ({ page }) => {
  const links = page.locator("a.v2-resume-shortcut, a.v2-resume-pass");
  await expect(links).toHaveCount(3);
  const hrefs = await links.evaluateAll((elements) =>
    elements.map((element) => element.getAttribute("href"))
  );
  expect(new Set(hrefs).size).toBe(1);
  expect(hrefs[0]).toContain(driveId);
  for (const link of await links.all()) {
    await expect(link).toHaveAccessibleName(/RÉSUMÉ|résumé/);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", /noopener noreferrer/);
  }
});

test("resume document pass has keyboard focus and an obvious hover affordance", async ({ page, isMobile }) => {
  const pass = page.locator(".v2-resume-pass");
  await pass.scrollIntoViewIfNeeded();
  await pass.focus();
  await expect(pass).toBeFocused();
  await expect(pass).toHaveCSS("outline-style", "solid");
  if (!isMobile) {
    await pass.hover();
    await expect(pass).toHaveCSS("border-top-color", "rgb(174, 230, 115)");
  }
});

test("resume links do not create horizontal overflow or overlap the scroll cue", async ({ page }) => {
  const geometry = await page.evaluate(() => {
    const rect = (selector) => document.querySelector(selector).getBoundingClientRect();
    const heroLink = rect(".v2-hero-resume");
    const cue = rect(".v2-hero-scroll-cue");
    const feature = rect(".v2-resume-pass");
    return {
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      heroLinkBottom: heroLink.bottom,
      cueTop: cue.top,
      featureLeft: feature.left,
      featureRight: feature.right,
      viewportWidth: document.documentElement.clientWidth,
    };
  });
  expect(geometry.horizontalOverflow).toBeLessThanOrEqual(2);
  expect(geometry.heroLinkBottom).toBeLessThan(geometry.cueTop + 2);
  expect(geometry.featureLeft).toBeGreaterThanOrEqual(-2);
  expect(geometry.featureRight).toBeLessThanOrEqual(geometry.viewportWidth + 2);
});
