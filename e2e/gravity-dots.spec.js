import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/, (route) => route.abort());
});

test("gravity dots stays behind the hero and keeps its contents interactive", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const hero = page.locator("#top");
  const field = hero.locator(".v2-gravity-dots");
  await expect(field).toHaveCount(1);
  await expect(field).toHaveAttribute("aria-hidden", "true");
  await expect(field).toHaveCSS("pointer-events", "none");

  const dimensions = await field.evaluate((canvas) => ({
    width: canvas.width,
    height: canvas.height,
    particles: Number(canvas.dataset.particles),
    canvasType: canvas.getContext("2d")?.constructor?.name,
  }));
  expect(dimensions.width).toBeGreaterThan(250);
  expect(dimensions.height).toBeGreaterThan(250);
  expect(dimensions.particles).toBeGreaterThan(100);
  expect(dimensions.particles).toBeLessThanOrEqual(1100);
  expect(dimensions.canvasType).toBe("CanvasRenderingContext2D");

  await expect(page.getByRole("heading", { name: /Backend.*engineer/i })).toBeVisible();
  await expect(hero.getByRole("link", { name: /EXPLORE MY WORK/i })).toBeVisible();
  await hero.getByRole("link", { name: /EXPLORE MY WORK/i }).click();
  await expect(page).toHaveURL(/#work$/);
});

test("desktop mouse movement activates gravity dots without intercepting links", async ({ page, isMobile }) => {
  test.skip(isMobile, "Mouse field is intentionally disabled on coarse-pointer devices");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const intro = page.getByRole("dialog", { name: "Portfolio introduction" });
  if (await intro.isVisible()) {
    await intro.getByRole("button", { name: /Skip intro/i }).click();
    await expect(intro).toHaveCount(0);
  }
  const canvas = page.locator(".v2-gravity-dots");
  await expect(canvas).toHaveAttribute("data-energy", "74");
  await expect(canvas).toHaveAttribute("data-radius", "225");

  const before = await canvas.evaluate((element) => element.toDataURL());
  const bounds = await canvas.boundingBox();
  await page.mouse.move(bounds.x + bounds.width * 0.52, bounds.y + bounds.height * 0.62, { steps: 4 });
  await expect(canvas).toHaveAttribute("data-interacting", "true");
  await expect.poll(async () => canvas.evaluate((element) => element.toDataURL()), {
    timeout: 4000,
  }).not.toBe(before);

  await page.mouse.move(bounds.x + bounds.width - 1, bounds.y + 1);
  await page.mouse.move(bounds.x - 10, bounds.y - 10);
  await expect(canvas).toHaveAttribute("data-interacting", "false");
});

test("reduced motion keeps the background static", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const canvas = page.locator(".v2-gravity-dots");
  await expect(canvas).toBeVisible();
  const bounds = await canvas.boundingBox();
  const before = await canvas.evaluate((element) => element.toDataURL());
  await page.mouse.move(bounds.x + bounds.width * 0.56, bounds.y + bounds.height * 0.62);
  await expect(canvas).toHaveAttribute("data-interacting", "false");
  const after = await canvas.evaluate((element) => element.toDataURL());
  expect(after).toBe(before);
});

test("mobile touch input preserves the native experience", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile-only touch check");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const canvas = page.locator(".v2-gravity-dots");
  await expect(canvas).toHaveAttribute("data-interacting", "false");
  await expect(canvas).toHaveCSS("pointer-events", "none");
  await page.locator("#overview").scrollIntoViewIfNeeded();
  await page.getByRole("navigation", { name: "Section navigation" })
    .getByRole("button", { name: "Open full section navigation" }).click();
  await expect(page.getByRole("dialog", { name: "Explore portfolio" })).toBeVisible();
});

test("hero gains no horizontal overflow from the dots canvas", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(2);
});
