import type { AccountId } from "@satellite-control/shared/types/branded";
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
