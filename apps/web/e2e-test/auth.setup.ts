import { test as setup, expect } from "@playwright/test";
import { mkdirSync } from "fs";
import path from "path";

// Canonical path consumed by playwright.config.ts and test files.
export const AUTH_FILE = path.join(__dirname, "../playwright/.auth/user.json");

// Runs once before all tests. Logs in via the mock API, saves cookies so
// every subsequent test starts already authenticated — no per-test login calls.
setup("authenticate", async ({ page }) => {
  mkdirSync(path.dirname(AUTH_FILE), { recursive: true });
  const res = await page.request.post("/api/auth/login", {
    data: { username: "admin", password: "admin123" },
  });
  expect(res.ok()).toBeTruthy();
  await page.context().storageState({ path: AUTH_FILE });
});
