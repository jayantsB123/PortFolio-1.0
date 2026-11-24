import { test, expect } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

async function openPortfolio(page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const intro = page.getByRole("dialog", { name: "Portfolio introduction" });
  if (await intro.isVisible()) {
    await intro.getByRole("button", { name: /Skip intro/i }).click();
  }
}

async function scrollToSectionPosition(page, placement) {
  await page.evaluate((position) => {
    const section = document.querySelector("#overview");
    const top = section.getBoundingClientRect().top + window.scrollY;
    const bottom = top + section.offsetHeight;
    const height = window.innerHeight;
    const target = position === "enter"
      ? top - height * 0.86
      : position === "exit"
        ? bottom - height * 0.22
        : top - height * 0.15;
    window.dispatchEvent(new WheelEvent("wheel", { deltaY: 120 }));
    window.scrollTo({ top: Math.max(0, target), behavior: "instant" });
  }, placement);
}

test("cinematic depth enters and exits in both directions", async ({ page }) => {
  await openPortfolio(page);
  const section = page.locator("#overview");
  const content = section.locator(":scope > .v2-container");
  await expect(section).toHaveClass(/v2-cinematic-section/);

  await scrollToSectionPosition(page, "enter");
  await expect.poll(async () => Number(await content.evaluate((node) =>
    node.style.getPropertyValue("--v2-cinema-tilt").replace("deg", "")
  ))).toBeLessThan(-1);

  await scrollToSectionPosition(page, "middle");
  await expect(content).toHaveAttribute("data-cinematic-resting", "true");
  await expect(content).toHaveCSS("filter", "none");

  await scrollToSectionPosition(page, "exit");
  await expect.poll(async () => Number(await content.evaluate((node) =>
    node.style.getPropertyValue("--v2-cinema-tilt").replace("deg", "")
  ))).toBeGreaterThan(1);

  await scrollToSectionPosition(page, "enter");
  await expect.poll(async () => Number(await content.evaluate((node) =>
    node.style.getPropertyValue("--v2-cinema-tilt").replace("deg", "")
  ))).toBeLessThan(-1);
});

test("reduced motion leaves section layout untouched", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await openPortfolio(page);
  const section = page.locator("#overview");
  await expect(section).not.toHaveClass(/v2-cinematic-section/);
  await expect(section.locator(":scope > .v2-container")).toHaveCSS("transform", "none");
});
