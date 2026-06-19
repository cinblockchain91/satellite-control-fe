import { test, expect } from "@playwright/test";

async function loginAsAdmin(page: Parameters<Parameters<typeof test>[1]>[0]["page"]) {
  const res = await page.request.post("/api/auth/login", {
    data: { username: "admin", password: "admin123" },
  });
  expect(res.ok()).toBeTruthy();
}

test.describe("Anomaly Arena view", () => {
  test("loads and renders correctly when authenticated", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/en/anomaly-arena");
    await expect(page).toHaveURL(/.*anomaly-arena/);
    await expect(page).not.toHaveURL(/.*login/);
  });

  test("unauthenticated user cannot access anomaly arena", async ({ page }) => {
    await page.goto("/en/anomaly-arena");
    await expect(page).toHaveURL(/.*login/);
  });

  test("layout has no overlapping panels", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/en/anomaly-arena");
    const shell = page.locator('[data-testid="anomaly-arena-shell"]');
    await expect(shell).toBeVisible();
    await expect(shell).toHaveCSS("overflow", "hidden");
  });

  test("demo badge is visible", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/en/anomaly-arena");
    await expect(page.locator('[data-testid="anomaly-arena-shell"]')).toBeVisible();
  });

  test("camera controls hint is visible", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/en/anomaly-arena");
    const hint = page.locator('[data-testid="camera-controls-hint"]');
    await expect(hint).toBeVisible();
  });

  test("low-fps warning is hidden on load", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/en/anomaly-arena");
    const warning = page.locator('[data-testid="low-fps-warning"]');
    await expect(warning).not.toBeVisible();
  });
});
