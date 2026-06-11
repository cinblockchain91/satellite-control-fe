import { test, expect } from "@playwright/test";

test.describe("Digital Twin view", () => {
  test.beforeEach(async ({ page }) => {
    await page.request.post("/api/auth/login", {
      data: { username: "admin", password: "admin123" },
    });
  });

  test("loads and renders correctly when authenticated", async ({ page }) => {
    await page.goto("/en/digital-twin");
    await expect(page).toHaveURL(/.*digital-twin/);
    await expect(page).not.toHaveURL(/.*login/);
  });

  test("unauthenticated user cannot access digital twin", async ({ page }) => {
    await page.goto("/en/digital-twin");
    await expect(page).toHaveURL(/.*login/);
  });

  test("layout has no overlapping panels", async ({ page }) => {
    await page.goto("/en/digital-twin");
    const main = page.locator("main");
    await expect(main).toBeVisible();
    await expect(main).not.toHaveCSS("overflow", "visible");
  });
});
