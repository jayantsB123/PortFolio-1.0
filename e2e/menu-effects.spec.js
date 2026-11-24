import { expect, test } from "@playwright/test";

test.use({ reducedMotion: "no-preference" });

async function openMenu(page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const loader = page.getByRole("dialog", { name: "Portfolio introduction" });
  if (await loader.isVisible()) {
    await loader.getByRole("button", { name: /Skip intro/i }).click();
  }
  await page.locator("#overview").scrollIntoViewIfNeeded();
  await page.getByRole("navigation", { name: "Section navigation" })
    .getByRole("button", { name: "Open full section navigation" }).click();
  return page.getByRole("dialog", { name: "Explore portfolio" });
}

test("menu reuses the current cursor background and card depth", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop hover only");
  const dialog = await openMenu(page);
  await expect(dialog).toHaveClass(/v2-quicknav-effects/);
  await expect(dialog.locator("canvas.v2-cursor-background")).toHaveCount(0);
  await dialog.locator(".v2-quicknav-top").hover({ position: { x: 250, y: 34 } });
  await expect(dialog.locator("canvas.v2-cursor-background"))
    .toHaveAttribute("data-style", /^(grid|constellation|ribbon|pixel)$/);

  const row = dialog.locator(".v2-quicknav-link").first();
  await row.hover({ position: { x: 5, y: 5 } });
  await expect(row).toHaveAttribute("data-depth-active", "true");
  await expect(row).toHaveClass(/v2-depth-card/);

  const close = dialog.getByRole("button", { name: "Close navigation" });
  await close.hover();
  await expect(page.locator(".v2-cursor-halo")).toHaveAttribute("data-mode", "label");
  await expect(page.locator(".v2-cursor-halo span")).toHaveText("CLOSE");
  await close.click();
  await expect(dialog).toHaveCount(0);
});

test("menu links scramble without rewriting their accessible text", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop pointer only");
  const dialog = await openMenu(page);
  const heading = dialog.locator(".v2-quicknav-content nav strong").first();
  await dialog.locator(".v2-quicknav-content").evaluate((element) =>
    Promise.all(element.getAnimations().map((animation) => animation.finished.catch(() => null)))
  );
  const original = await heading.textContent();
  const glyph = await heading.evaluate((element) => {
    const range = document.createRange();
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const node = walker.nextNode();
    range.setStart(node, 0);
    range.setEnd(node, 1);
    return range.getBoundingClientRect().toJSON();
  });

  await page.mouse.move(0, 0);
  await page.mouse.move(glyph.x + glyph.width * .82, glyph.y + glyph.height * .5);
  await expect(heading).toHaveClass(/v2-scramble-active/);
  await expect(page.locator(".v2-scramble-layer")).toHaveCount(1);
  await expect(heading).toHaveText(original);
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(page.locator(".v2-scramble-layer")).toHaveCount(0, { timeout: 3000 });
});

test("reduced motion leaves the menu static and navigable", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const dialog = await openMenu(page);
  await expect(dialog.locator(".v2-quicknav-content")).toHaveCSS("animation-name", "none");
  await expect(dialog.locator("canvas.v2-cursor-background")).toHaveCount(0);
  await expect(dialog.getByRole("button", { name: "Close navigation" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
});
