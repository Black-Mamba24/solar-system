import { expect, test } from "@playwright/test";

test("home page exposes only overview as clickable", async ({ page }) => {
  await page.goto("/?lang=en");

  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Explore the Solar System" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Enter overview/ })).toBeVisible();
  await expect(page.getByText("Coming soon")).toHaveCount(5);
});

test("overview renders learning controls", async ({ page }) => {
  await page.goto("/overview?lang=en");

  await expect(page.getByRole("heading", { name: "Solar System Overview" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
  await expect(page.getByText("Scale compressed for learning")).toBeVisible();
});

test("language switch keeps page usable", async ({ page }) => {
  await page.goto("/overview?lang=zh");

  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
  await expect(page.getByRole("heading", { name: "太阳系概述" })).toBeVisible();
  await page.getByRole("button", { name: "切换语言" }).click();
  await expect(page).toHaveURL(/lang=en/);
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Solar System Overview" })).toBeVisible();
});
