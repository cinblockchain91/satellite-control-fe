export const MOCK_ACCOUNT = {
  id: "550e8400-e29b-41d4-a716-446655440001",
  username: "admin",
  email: "admin@satellite-control.io",
  role: "admin",
  fullName: "System Administrator",
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

export const MOCK_CREDENTIALS = { username: "admin", password: "admin123" };

export const TOKEN_COOKIE = {
  name: "access_token",
  value: "mock-token",
  options: {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    maxAge: 60 * 60 * 24,
  },
};
