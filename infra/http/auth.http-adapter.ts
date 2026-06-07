import type { AuthPort } from "@satellite-control/shared/port/auth.port";
import type { Account } from "@satellite-control/entity-account";
import { AccountSchema } from "@satellite-control/entity-account";
import { httpClient } from "./client";

export const authHttpAdapter: AuthPort<Account> = {
  async login(username: string, password: string): Promise<Account> {
    const data = await httpClient.post<unknown>("/api/auth/login", {
      username,
      password,
    });
    return AccountSchema.parse(data) as Account;
  },

  async logout(): Promise<void> {
    await httpClient.post("/api/auth/logout", {});
  },

  async getMe(): Promise<Account> {
    const data = await httpClient.get<unknown>("/api/auth/me");
    return AccountSchema.parse(data) as Account;
  },
};
