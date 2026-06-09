import type { AccountRole } from "@satellite-control/entity-account";

export interface MockUser {
  account: {
    id: string;
    username: string;
    email: string;
    role: AccountRole;
    fullName: string;
    lastLoginAt: string;
    createdAt: string;
  };
  password: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    account: {
      id: "550e8400-e29b-41d4-a716-446655440001",
      username: "admin",
      email: "admin@satellite-control.io",
      role: "admin",
      fullName: "System Administrator",
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    password: "admin123",
  },
  {
    account: {
      id: "550e8400-e29b-41d4-a716-446655440002",
      username: "engineer",
      email: "engineer@satellite-control.io",
      role: "engineer",
      fullName: "Flight Engineer",
      lastLoginAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
    password: "engineer123",
  },
];

export const TOKEN_COOKIE = {
  name: "access_token",
  options: {
    httpOnly: true,
    path: "/",
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  },
};

export function findUserByCredentials(
  username: string,
  password: string,
): MockUser | undefined {
  return MOCK_USERS.find(
    (u) => u.account.username === username && u.password === password,
  );
}

export function findUserById(id: string): MockUser | undefined {
  return MOCK_USERS.find((u) => u.account.id === id);
}
