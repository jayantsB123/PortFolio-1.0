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
  await expect(page.locator(".v2-engine canvas")).toHaveCount(0);
  await expect(page.locator(".v2-gravity-dots")).toHaveCount(1);
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
  await page.getByRole("navigation", { name: "Section navigation" })
    .getByRole("button", { name: "Open full section navigation" }).click();
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
  await expect(page.getByRole("link", { name: "Scroll to explore the portfolio overview" })).toBeVisible();
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


test("hero uses one clear introduction without duplicate metadata", async ({ page }) => {
  await expect(page.locator(".v2-hero-top")).toHaveCount(0);
  await expect(page.locator(".v2-hero-evidence")).toHaveCount(0);
  await expect(page.locator(".v2-hero-foot")).toHaveCount(0);
  await expect(page.locator(".v2-hero h1")).toContainText("Software");
  await expect(page.locator(".v2-hero-description")).toBeVisible();
  await expect(page.locator(".v2-landing-header")).toHaveCSS("border-bottom-width", "0px");
});

test("navigation progress hugs the compact rail boundary", async ({ page, isMobile }) => {
  test.skip(isMobile, "The mobile dock intentionally hides the rail progress");
  await page.locator("#experience").scrollIntoViewIfNeeded();
  const rail = page.getByRole("navigation", { name: "Section navigation" });
  await expect(rail).toBeVisible();
  const metrics = await page.evaluate(() => {
    const rail = document.querySelector(".v2-side-rail").getBoundingClientRect();
    const track = document.querySelector(".v2-rail-track").getBoundingClientRect();
    return {
      width: rail.width,
      height: rail.height,
      leftDelta: Math.abs(rail.left - track.left),
      trackHeight: track.height
    };
  });
  expect(metrics.height).toBeLessThan(510);
  expect(metrics.leftDelta).toBeLessThanOrEqual(4);
  expect(metrics.trackHeight).toBeGreaterThan(200);
});

test("scramble activates on the right half of an actual glyph without reflow", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop pointer interaction only");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const heading = page.getByRole("heading", { name: "At a glance." });
  await heading.scrollIntoViewIfNeeded();
  const before = await heading.evaluate((element) => ({
    text: element.textContent,
    box: element.getBoundingClientRect().toJSON(),
    lines: element.getClientRects().length,
  }));
  const glyph = await heading.evaluate((element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const range = document.createRange();
    let node;
    while ((node = walker.nextNode())) {
      const value = node.textContent || "";
      const letter = value.search(/[a-z]/i);
      if (letter === -1) continue;
      range.setStart(node, letter);
      range.setEnd(node, letter + 1);
      const rect = range.getBoundingClientRect();
      if (rect.width > 2) return rect.toJSON();
    }
    throw new Error("Could not measure title glyph");
  });

  await page.mouse.move(0, 0);
  await page.mouse.move(glyph.x + glyph.width * .22, glyph.y + glyph.height * .5);
  await expect(heading).not.toHaveClass(/v2-scramble-active/);
  await expect(page.locator(".v2-scramble-layer")).toHaveCount(0);

  await page.mouse.move(glyph.x + glyph.width * .82, glyph.y + glyph.height * .5);
  await expect(heading).toHaveClass(/v2-scramble-active/);
  await expect(page.locator(".v2-scramble-layer")).toHaveCount(1);
  const during = await heading.evaluate((element) => ({
    text: element.textContent,
    box: element.getBoundingClientRect().toJSON(),
    lines: element.getClientRects().length,
  }));
  expect(during.text).toEqual(before.text);
  expect(during.lines).toEqual(before.lines);
  expect(Math.abs(during.box.width - before.box.width)).toBeLessThan(.2);
  expect(Math.abs(during.box.height - before.box.height)).toBeLessThan(.2);

  await expect(heading).not.toHaveClass(/v2-scramble-active/, { timeout: 3500 });
  await expect(page.locator(".v2-scramble-layer")).toHaveCount(0);
  await expect(heading).toHaveText(before.text);
});

test("scramble stays off metadata and secondary headings", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop pointer interaction only");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const subtitle = page.locator(".v2-role-main h3").first();
  await subtitle.scrollIntoViewIfNeeded();
  await subtitle.hover();
  await expect(subtitle).not.toHaveClass(/v2-scramble-active/);
  await expect(page.locator(".v2-scramble-layer")).toHaveCount(0);
});
