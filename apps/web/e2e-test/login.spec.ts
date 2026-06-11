import { test, expect } from "@playwright/test";

test.describe("Login flow", () => {
  test("redirects to login page when unauthenticated", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/.*login/);
  });

  test("shows validation error when submitting empty fields", async ({
    page,
  }) => {
    await page.goto("/en/login");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(
      page.getByText("Please enter username and password"),
    ).toBeVisible();
  });

  test("authenticated user is redirected away from login", async ({ page }) => {
    // Login via API — cookie is stored in page's browser context automatically
    const res = await page.request.post("/api/auth/login", {
      data: { username: "admin", password: "admin123" },
    });
    expect(res.ok()).toBeTruthy();
    await page.goto("/en/login");
    await expect(page).toHaveURL(/.*dashboard/);
  });

  test("unauthenticated user cannot access dashboard", async ({ page }) => {
    await page.goto("/en/dashboard");
    await expect(page).toHaveURL(/.*login/);
  });
});
