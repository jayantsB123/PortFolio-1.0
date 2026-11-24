import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

test("the 3D engine does not initialize behind the opening intro", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const intro = page.getByRole("dialog", { name: "Portfolio introduction" });
  await expect(intro).toBeVisible();
  await expect(page.locator(".v2-engine canvas")).toHaveCount(0);
  await intro.getByRole("button", { name: /Skip intro/i }).click();
  await expect(intro).toHaveCount(0);
  await expect(page.locator(".v2-engine-control")).toBeVisible();
  await page.locator(".v2-engine-control").click();
  await expect(page.locator(".v2-engine-control")).toHaveAttribute("aria-pressed", "true");
});
