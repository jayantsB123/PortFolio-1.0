import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

test("the 3D engine does not initialize behind the opening intro", async ({ page, isMobile }) => {
  await page.addInitScript(() => {
    window.__earlyWebGL = 0;
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      if (/^(webgl2?|experimental-webgl)$/.test(type) && document.querySelector(".v2-intro-overlay")) {
        window.__earlyWebGL += 1;
      }
      return getContext.call(this, type, ...args);
    };
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const intro = page.getByRole("dialog", { name: "Portfolio introduction" });
  await expect(intro).toBeVisible();
  await expect(page.locator(".v2-engine canvas")).toHaveCount(0);
  await intro.getByRole("button", { name: /Skip intro/i }).click();
  await expect(intro).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe("hidden");
  expect(await page.evaluate(() => window.__earlyWebGL)).toBe(0);

  const control = page.locator(".v2-engine-control");
  if (isMobile) {
    await expect(control).toBeHidden();
    await expect(page.getByRole("link", { name: "Scroll to explore the portfolio overview" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  } else {
    await expect(control).toBeVisible();
    await control.click();
    await expect(control).toHaveAttribute("aria-pressed", "true");
    await control.click();
    await expect(control).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByRole("link", { name: "Scroll to explore the portfolio overview" })).toBeVisible();
  }
});
