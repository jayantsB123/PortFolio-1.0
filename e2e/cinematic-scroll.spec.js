import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

async function openPortfolio(page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const intro = page.getByRole("dialog", { name: "Portfolio introduction" });
  if (await intro.isVisible()) await intro.getByRole("button", { name: /Skip intro/i }).click();
  await expect(page.locator(".v2-intro-overlay")).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
}

async function scrollToSectionPosition(page, placement) {
  return page.evaluate(async (position) => {
    const section = document.querySelector("#overview");
    const content = section.querySelector(":scope > .v2-container");
    const top = section.getBoundingClientRect().top + window.scrollY;
    const bottom = top + section.offsetHeight;
    const height = window.innerHeight;
    const target = position === "enter"
      ? top - height * 0.86
      : position === "exit"
        ? bottom - height * 0.22
        : top - height * 0.15;

    return new Promise((resolve) => {
      let tilt = 0;
      const observer = new MutationObserver(() => {
        const value = Number.parseFloat(content.style.getPropertyValue("--v2-cinema-tilt")) || 0;
        if (Math.abs(value) > Math.abs(tilt)) tilt = value;
      });
      observer.observe(content, { attributes: true, attributeFilter: ["style"] });
      window.dispatchEvent(new WheelEvent("wheel", { deltaY: target - window.scrollY }));
      window.scrollTo({ top: Math.max(0, target), behavior: "instant" });
      window.setTimeout(() => {
        observer.disconnect();
        resolve(tilt);
      }, 450);
    });
  }, placement);
}

test("cinematic depth enters and exits in both directions", async ({ page }) => {
  await openPortfolio(page);
  const section = page.locator("#overview");
  const content = section.locator(":scope > .v2-container");
  await expect(section).toHaveClass(/v2-cinematic-section/);
  expect(await scrollToSectionPosition(page, "enter")).toBeLessThan(-1);
  await expect(content).toHaveAttribute("data-cinematic-resting", "true");
  await scrollToSectionPosition(page, "middle");
  await expect(content).toHaveCSS("filter", "none");
  expect(await scrollToSectionPosition(page, "exit")).toBeGreaterThan(1);
  expect(await scrollToSectionPosition(page, "enter")).toBeLessThan(-1);
  await expect(content).toHaveAttribute("data-cinematic-resting", "true");
  await expect(content).toHaveCSS("transform", "none");
});

test("reduced motion leaves section layout untouched", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openPortfolio(page);
  const section = page.locator("#overview");
  await expect(section).not.toHaveClass(/v2-cinematic-section/);
  await expect(section.locator(":scope > .v2-container")).toHaveCSS("transform", "none");
});
