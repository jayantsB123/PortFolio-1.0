import { expect, test } from "@playwright/test";

test("browser tab uses circuit trace by default", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle("Jayant Singh | SDE · FinTech");
  const favicon = page.locator('link[rel="icon"]');
  await expect(favicon).toHaveAttribute("type", "image/svg+xml");
  await expect(favicon).toHaveAttribute("href", "/favicons/circuit.svg");
});

test("all five tab icons are served as SVG files", async ({ request }) => {
  for (const style of ["signature", "monogram", "terminal", "orbit", "circuit"]) {
    const response = await request.get("/favicons/" + style + ".svg");
    expect(response.ok()).toBeTruthy();
    expect(await response.text()).toContain('viewBox="0 0 64 64"');
  }
});
