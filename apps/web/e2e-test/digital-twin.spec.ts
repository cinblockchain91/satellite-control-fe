import { test, expect } from "@playwright/test";

async function loginAsAdmin(page: Parameters<Parameters<typeof test>[1]>[0]["page"]) {
  const res = await page.request.post("/api/auth/login", {
    data: { username: "admin", password: "admin123" },
  });
  expect(res.ok()).toBeTruthy();
}

test.describe("Digital Twin view", () => {
  test("loads and renders correctly when authenticated", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/en/digital-twin");
    await expect(page).toHaveURL(/.*digital-twin/);
    await expect(page).not.toHaveURL(/.*login/);
  });

  test("unauthenticated user cannot access digital twin", async ({ page }) => {
    await page.goto("/en/digital-twin");
    await expect(page).toHaveURL(/.*login/);
  });

  test("layout has no overlapping panels", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/en/digital-twin");
    const shell = page.locator('[data-testid="digital-twin-shell"]');
    await expect(shell).toBeVisible();
    await expect(shell).toHaveCSS("overflow", "hidden");
  });
});
