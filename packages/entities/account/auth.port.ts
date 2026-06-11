import type { Account } from "./account.entity";

export interface AuthPort {
  login(username: string, password: string): Promise<Account>;
  logout(): Promise<void>;
  getMe(): Promise<Account>;
}
