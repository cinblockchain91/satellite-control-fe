import type { Brand } from "@satellite-control/shared/types/branded";

export type AccountId = Brand<string, "AccountId">;
export const AccountId = (id: string): AccountId => id as AccountId;

export type AccountRole = "admin" | "engineer" | "viewer";

export interface Account {
  id: AccountId;
  username: string;
  email: string;
  role: AccountRole;
  fullName: string;
  avatarUrl?: string;
  lastLoginAt: string;
  createdAt: string;
}
