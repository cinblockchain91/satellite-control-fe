import { defineConfig, devices } from "@playwright/test";
import path from "path";

const AUTH_FILE = path.join(__dirname, "playwright/.auth/user.json");

export default defineConfig({
  testDir: "./e2e-test",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  ...(process.env.CI && { workers: 1 }),
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    // Runs once; logs in and saves cookies to AUTH_FILE.
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },
    // All other tests inherit AUTH_FILE cookies (authenticated by default).
    // Tests that need an unauthenticated context override via:
    //   test.use({ storageState: { cookies: [], origins: [] } })
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        storageState: AUTH_FILE,
      },
      dependencies: ["setup"],
    },
  ],
  webServer: {
    command: "pnpm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    env: {
      JWT_SECRET: "e2e-test-secret-32-chars-minimum!",
    },
  },
});
