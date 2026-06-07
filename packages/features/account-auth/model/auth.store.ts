import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Account } from "@satellite-control/entity-account";

interface AuthState {
  account: Account | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setAccount: (data: Account | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      account: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      setAccount: (account: Account | null) =>
        set({ account, isAuthenticated: !!account }),
      setLoading: (isLoading: boolean) =>
        set({ isLoading }, false, "setLoading"),
      setError: (error: string | null) => set({ error }, false, "setError"),
      reset: () => set({ account: null, isAuthenticated: false, error: null }),
    }),
    { name: "AuthStore" },
  ),
);
