import { http, HttpResponse } from "msw";

const mockAccount = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  username: "admin",
  email: "admin@satellite-control.io",
  role: "admin",
  fullName: "System Administrator",
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

export const authHandlers = [
  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as {
      username: string;
      password: string;
    };

    if (body.username === "admin" && body.password === "admin123") {
      return HttpResponse.json(mockAccount);
    }

    return HttpResponse.json(
      { message: "Invalid username or password" },
      { status: 401 },
    );
  }),

  http.post("/api/auth/logout", () => {
    return new HttpResponse(null, { status: 204 });
  }),

  http.get("/api/auth/me", () => {
    return HttpResponse.json(mockAccount);
  }),

  http.post("/api/auth/refresh", () => {
    return new HttpResponse(null, { status: 200 });
  }),
];
