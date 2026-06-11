import type { AccountId } from "@satellite-control/entity-account";

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  accounts: {
    all: ["accounts"] as const,
    lists: () => [...queryKeys.accounts.all, "list"] as const,
    detail: (id: AccountId) =>
      [...queryKeys.accounts.all, "detail", id] as const,
  },
} as const;
