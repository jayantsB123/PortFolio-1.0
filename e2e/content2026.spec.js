import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.route(/fonts\.googleapis\.com|fonts\.gstatic\.com/, (route) => route.abort());
  await page.goto("/", { waitUntil: "domcontentloaded" });
});

test("hero, overview and education explain the current engineering profile", async ({ page }) => {
  await expect(page.locator("#top h1")).toContainText("Backend");
  await expect(page.locator("#top h1")).toContainText("engineer");
  await expect(page.locator("#top .v2-hero-specialty")).toContainText("Distributed Systems");
  await expect(page.locator("#top .v2-hero-description")).toContainText("Digital Rupee");
  await expect(page.getByRole("heading", { name: "Engineering that holds up in production." })).toBeVisible();
  await expect(page.locator(".v2-overview-grid .v2-overview-fact")).toHaveCount(4);
  await expect(page.locator(".v2-overview-fact").filter({ hasText: "Sarvatra Technologies" })).toBeVisible();
  await expect(page.locator(".v2-overview-education")).toContainText("8.95 CGPA");
  await expect(page.locator("#education")).toContainText("Computer Engineering");
  const resume = page.locator(".v2-resume-inline").getByRole("link", {
    name: "View résumé in Google Drive (opens in a new tab)",
  });
  await expect(resume).toHaveAttribute("href", /1igz5xhAoM-RMV8uaABzgK6fhWDeNdutO/);
  await expect(resume).toHaveAttribute("target", "_blank");
});

test("current SDE impact is visible first; older duties expand on demand", async ({ page }) => {
  const roles = page.locator(".v2-role-featured");
  await expect(roles).toHaveCount(2);
  await expect(page.locator(".v2-role-earlier")).toHaveCount(3);
  const current = roles.first();
  await expect(current).toContainText("Jul 2025");
  await expect(current).toContainText("Sarvatra Technologies");
  await expect(current.locator("li")).toHaveCount(4);
  const more = current.getByRole("button", { name: /SHOW MORE WORK/ });
  await expect(more).toHaveAttribute("aria-expanded", "false");
  await more.click();
  await expect(current.locator("li")).toHaveCount(10);
  await expect(current.getByRole("button", { name: /SHOW LESS/ })).toHaveAttribute("aria-expanded", "true");
  await current.getByRole("button", { name: /SHOW LESS/ }).click();
  await expect(current.locator("li")).toHaveCount(4);
});

test("recognition is discoverable and includes six achievements", async ({ page }) => {
  const recognition = page.locator(".v2-overview-fact").filter({ hasText: "RECOGNITION" });
  await expect(recognition).toHaveAttribute("href", "#achievements");
  await recognition.click();
  await expect(page).toHaveURL(/#achievements$/);
  const section = page.locator("#achievements");
  await expect(section.getByRole("heading", { name: "Proven beyond the code." })).toBeVisible();
  await expect(section.locator(".v2-achievement")).toHaveCount(6);
  await expect(section).toContainText("RBI Harbinger 2025");
  await expect(section).toContainText("Codeforces");
});

test("four fintech cases are featured, with confidential work visibly labeled", async ({ page }) => {
  const projects = page.locator(".v2-project-list-row");
  await expect(projects).toHaveCount(4);
  await expect(projects.first()).toContainText("Sentinel-Ledger");
  await expect(projects.nth(1)).toContainText("CBDC Payment-Failure");
  await expect(projects.nth(1)).toContainText("SOURCE UNAVAILABLE");
  await expect(page.locator(".v2-supporting-row")).toHaveCount(3);
  await expect(page.locator(".v2-supporting-projects")).toContainText("RegisterRover");
  await projects.first().getByRole("button", { name: /Read case study/ }).click();
  const modal = page.getByRole("dialog", { name: "Sentinel-Ledger" });
  await expect(modal.getByRole("heading", { name: "Sentinel-Ledger" })).toBeVisible();
  await expect(modal).toContainText("UP NEXT");
  await expect(modal.getByRole("link", { name: "VIEW SOURCE ↗" })).toHaveAttribute("href", /Sentinel-Ledger/);
  await page.keyboard.press("Escape");
  await expect(modal).toHaveCount(0);
});

test("longer mobile content stays readable without horizontal overflow", async ({ page }) => {
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(2);
  const ctas = await page.evaluate(() => {
    const actions = document.querySelector(".v2-hero-actions").getBoundingClientRect();
    const cue = document.querySelector(".v2-hero-scroll-cue").getBoundingClientRect();
    return { actionsBottom: actions.bottom, cueTop: cue.top };
  });
  expect(ctas.actionsBottom).toBeLessThan(ctas.cueTop + 2);
});
