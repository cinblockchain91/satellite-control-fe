import type { AuthPort } from "@satellite-control/shared/port/auth.port";
import type { Account } from "@satellite-control/entity-account";
import { AccountId } from "@satellite-control/shared/types/branded";

const mockAccount: Account = {
  id: AccountId("550e8400-e29b-41d4-a716-446655440001"),
  username: "admin",
  email: "admin@satellite-control.io",
  role: "admin",
  fullName: "System Administrator",
  lastLoginAt: new Date().toISOString(),
  createdAt: new Date().toISOString(),
};

export const authMockAdapter: AuthPort<Account> = {
  async login(username, password) {
    await new Promise((res) => setTimeout(res, 500));

    if (username === "admin" && password === "admin123") {
      document.cookie = "access_token=mock-token; path=/";
      return mockAccount;
    }

    throw new Error("Invalid username or password");
  },

  async logout() {
    await new Promise((res) => setTimeout(res, 200));
    document.cookie = "access_token=; path=/; max-age=0";
  },

  async getMe() {
    await new Promise((res) => setTimeout(res, 300));
    return mockAccount;
  },
};
