import type { AuthPort, Account } from "@satellite-control/entity-account";
import { AccountSchema } from "@satellite-control/entity-account";
import type { HttpClient } from "@satellite-control/infra-http";

export function createAuthHttpAdapter(client: HttpClient): AuthPort {
  return {
    async login(username: string, password: string): Promise<Account> {
      const data = await client.post<unknown>("/api/auth/login", {
        username,
        password,
      });
      return AccountSchema.parse(data) as Account;
    },

    async logout(): Promise<void> {
      await client.post("/api/auth/logout", {});
    },

    async getMe(): Promise<Account> {
      const data = await client.get<unknown>("/api/auth/me");
      return AccountSchema.parse(data) as Account;
    },
  };
}
