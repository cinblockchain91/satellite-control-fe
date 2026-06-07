import { useAuthStore } from "./auth.store";
export const useCurrentAccount = () => useAuthStore((s) => s.account);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useAccountRole = () =>
  useAuthStore((s) => s.account?.role ?? null);
export const useIsAdmin = () =>
  useAuthStore((s) => s.account?.role === "admin");
