import { test, expect } from "@playwright/test";

// Authenticated tests — cookies come from playwright.config.ts storageState.
test.describe("Digital Twin view", () => {
  test("loads and renders correctly when authenticated", async ({ page }) => {
    await page.goto("/en/digital-twin");
    await expect(page).toHaveURL(/.*digital-twin/);
    await expect(page).not.toHaveURL(/.*login/);
  });

  test("layout has no overlapping panels", async ({ page }) => {
    await page.goto("/en/digital-twin");
    const shell = page.locator('[data-testid="digital-twin-shell"]');
    await expect(shell).toBeVisible();
    await expect(shell).toHaveCSS("overflow", "hidden");
  });
});

// Unauthenticated tests — override project storageState with empty state.
test.describe("Digital Twin — auth guard", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("unauthenticated user cannot access digital twin", async ({ page }) => {
    await page.goto("/en/digital-twin");
    await expect(page).toHaveURL(/.*login/);
  });
});

test.describe("Digital Twin — satellite selection", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/en/digital-twin");
    await expect(page).toHaveURL(/.*digital-twin/);
  });

  test("telemetry panel shows no-selection state on load", async ({ page }) => {
    const noSelection = page.locator('[data-testid="telemetry-no-selection"]');
    await expect(noSelection).toBeVisible();
    const detail = page.locator('[data-testid="telemetry-satellite-detail"]');
    await expect(detail).not.toBeVisible();
  });

  test("clicking empty canvas area keeps panel in no-selection state", async ({ page }) => {
    const canvas = page.locator("canvas");
    await canvas.waitFor({ state: "visible" });
    const box = await canvas.boundingBox();
    if (!box) throw new Error("canvas not found");
    await page.mouse.click(box.x + box.width * 0.5, box.y + box.height * 0.85);
    const noSelection = page.locator('[data-testid="telemetry-no-selection"]');
    await expect(noSelection).toBeVisible();
  });
});
