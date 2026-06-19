import { test, expect } from "@playwright/test";

// Unauthenticated tests — override project storageState with empty state.
// These tests verify behaviour that requires the user to NOT be logged in.
test.describe("Login flow — unauthenticated", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("redirects to login page when unauthenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*login/);
  });

  test("shows validation error when submitting empty fields", async ({ page }) => {
    await page.goto("/en/login");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Please enter username and password")).toBeVisible();
  });

  test("unauthenticated user cannot access dashboard", async ({ page }) => {
    await page.goto("/en/dashboard");
    await expect(page).toHaveURL(/.*login/);
  });
});

// Authenticated test — cookies come from playwright.config.ts storageState.
test.describe("Login flow — authenticated", () => {
  test("authenticated user is redirected away from login", async ({ page }) => {
    await page.goto("/en/login");
    await expect(page).toHaveURL(/.*dashboard/);
  });
});
