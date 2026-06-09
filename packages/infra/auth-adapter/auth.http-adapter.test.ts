import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from "vitest";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { createHttpClient } from "@satellite-control/infra-http";
import { createAuthHttpAdapter } from "./auth.http-adapter";

const BASE_URL = "http://localhost:3000";
const client = createHttpClient(BASE_URL);
const authHttpAdapter = createAuthHttpAdapter(client);

const mockAccount = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  username: "admin",
  email: "admin@example.com",
  role: "admin",
  fullName: "Admin User",
  lastLoginAt: "2024-01-01T00:00:00Z",
  createdAt: "2024-01-01T00:00:00Z",
};

const server = setupServer();

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("authHttpAdapter", () => {
  describe("login", () => {
    it("returns Account on successful login", async () => {
      server.use(
        http.post(`${BASE_URL}/api/auth/login`, () =>
          HttpResponse.json(mockAccount),
        ),
      );

      const result = await authHttpAdapter.login("admin", "admin123");
      expect(result).toMatchObject({ username: "admin", role: "admin" });
    });

    it("throws when server returns data that fails schema validation", async () => {
      server.use(
        http.post(`${BASE_URL}/api/auth/login`, () =>
          HttpResponse.json({ invalid: "data" }),
        ),
      );

      await expect(
        authHttpAdapter.login("admin", "admin123"),
      ).rejects.toThrow();
    });
  });

  describe("logout", () => {
    it("resolves without error on successful logout", async () => {
      server.use(
        http.post(
          `${BASE_URL}/api/auth/logout`,
          () => new HttpResponse(null, { status: 204 }),
        ),
      );

      await expect(authHttpAdapter.logout()).resolves.toBeUndefined();
    });
  });

  describe("getMe", () => {
    it("returns Account for authenticated user", async () => {
      server.use(
        http.get(`${BASE_URL}/api/auth/me`, () =>
          HttpResponse.json(mockAccount),
        ),
      );

      const result = await authHttpAdapter.getMe();
      expect(result).toMatchObject({ username: "admin" });
    });

    it("throws when server returns data that fails schema validation", async () => {
      server.use(
        http.get(`${BASE_URL}/api/auth/me`, () =>
          HttpResponse.json({ invalid: "data" }),
        ),
      );

      await expect(authHttpAdapter.getMe()).rejects.toThrow();
    });
  });
});
