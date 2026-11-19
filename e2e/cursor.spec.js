import { test, expect } from "@playwright/test";

// The application's default browser suite uses reduced motion. Override it in
// this file to exercise the desktop-only progressive enhancement.
test.use({ reducedMotion: "no-preference" });

test("desktop mouse gets a non-intercepting contextual cursor", async ({ page, isMobile }) => {
  test.skip(isMobile, "Touch and mobile devices use the native pointer");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const root = page.locator(".v2-root");
  await expect(root).toHaveClass(/v2-cursor-enabled/);
  const explore = page.getByRole("button", { name: "Explore sections of the portfolio" });
  await explore.hover();
  await expect(page.locator(".v2-cursor-halo")).toHaveAttribute("data-mode", "label");
  await expect(page.locator(".v2-cursor-halo span")).toHaveText("MENU");
  await expect(page.locator(".v2-custom-cursor")).toHaveCSS("pointer-events", "none");

  await explore.click();
  await expect(page.getByRole("dialog", { name: "Explore portfolio" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Explore portfolio" })).not.toBeVisible();
});

test("touch devices keep the normal pointer", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Only applies to touch emulation");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".v2-root")).not.toHaveClass(/v2-cursor-enabled/);
  await expect(page.locator(".v2-custom-cursor")).toBeHidden();
});

test("reduced motion disables the cursor enhancement", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(".v2-root")).not.toHaveClass(/v2-cursor-enabled/);
  await expect(page.locator(".v2-custom-cursor")).toBeHidden();
});

test("cursor switches to dark contrast on pale sections", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop pointer enhancement only");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.locator("#overview").scrollIntoViewIfNeeded();
  const card = page.locator(".v2-overview-fact").first();
  await card.hover();
  await expect(page.locator(".v2-cursor-halo")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".v2-cursor-dot")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".v2-custom-cursor")).toHaveCSS("pointer-events", "none");
});

test("headings expose a visual cursor state without changing their text", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop pointer enhancement only");
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const heading = page.getByRole("heading", { name: "At a glance." });
  await heading.hover();
  await expect(page.locator(".v2-cursor-halo")).toHaveAttribute("data-mode", "heading");
  await expect(heading).toHaveText("At a glance.");
});
