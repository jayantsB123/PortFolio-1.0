import { test, expect } from "@playwright/test";

test("main content and the menu work without animation", async ({ page }) => {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle("Jayant Singh | SDE · FinTech");
  await expect(page.locator("#overview")).toBeVisible();
  await page.locator("#overview").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Open full section navigation" }).click();
  const menu = page.getByRole("dialog", { name: "Explore portfolio" });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});
