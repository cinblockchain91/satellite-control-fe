import type { Account, AccountRole } from "@satellite-control/entity-account";

export function hasPermission(role: AccountRole, requiredRole: AccountRole) {
  const hierarchy: Record<AccountRole, number> = {
    admin: 3,
    engineer: 2,
    viewer: 1,
  };
  return hierarchy[role] >= hierarchy[requiredRole];
}

export function getDisplayName(fullName: string): string {
  return fullName.split(" ").slice(-1)[0] ?? fullName;
}
