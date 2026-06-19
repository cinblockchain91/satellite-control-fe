import { test, expect } from "@playwright/test";

// Authenticated tests — cookies come from playwright.config.ts storageState.
test.describe("Anomaly Arena view", () => {
  test("loads and renders correctly when authenticated", async ({ page }) => {
    await page.goto("/en/anomaly-arena");
    await expect(page).toHaveURL(/.*anomaly-arena/);
    await expect(page).not.toHaveURL(/.*login/);
  });

  test("layout has no overlapping panels", async ({ page }) => {
    await page.goto("/en/anomaly-arena");
    const shell = page.locator('[data-testid="anomaly-arena-shell"]');
    await expect(shell).toBeVisible();
    await expect(shell).toHaveCSS("overflow", "hidden");
  });

  test("camera controls hint is visible", async ({ page }) => {
    await page.goto("/en/anomaly-arena");
    const hint = page.locator('[data-testid="camera-controls-hint"]');
    await expect(hint).toBeVisible();
  });

  test("low-fps warning is hidden on load", async ({ page }) => {
    await page.goto("/en/anomaly-arena");
    const warning = page.locator('[data-testid="low-fps-warning"]');
    await expect(warning).not.toBeVisible();
  });
});

// Unauthenticated tests — override project storageState with empty state.
test.describe("Anomaly Arena — auth guard", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("unauthenticated user is redirected to login", async ({ page }) => {
    await page.goto("/en/anomaly-arena");
    await expect(page).toHaveURL(/.*login/);
  });
});
