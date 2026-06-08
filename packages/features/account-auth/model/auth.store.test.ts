import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./auth.store";
import type { Account } from "@satellite-control/entity-account";

const mockAccount: Account = {
  id: "550e8400-e29b-41d4-a716-446655440000" as any,
  username: "nguyenvanan",
  email: "an@example.com",
  role: "admin",
  fullName: "Nguyen Van An",
  lastLoginAt: "2024-01-01T00:00:00Z",
  createdAt: "2024-01-01T00:00:00Z",
};

describe("useAuthStore", () => {
  beforeEach(() => {
    useAuthStore.getState().reset();
  });

  it("state ban đầu là unauthenticated", () => {
    const { account, isAuthenticated, isLoading, error } =
      useAuthStore.getState();
    expect(account).toBeNull();
    expect(isAuthenticated).toBe(false);
    expect(isLoading).toBe(false);
    expect(error).toBeNull();
  });

  it("setAccount cập nhật account và isAuthenticated", () => {
    useAuthStore.getState().setAccount(mockAccount);
    const { account, isAuthenticated } = useAuthStore.getState();
    expect(account).toEqual(mockAccount);
    expect(isAuthenticated).toBe(true);
  });

  it("setAccount(null) set isAuthenticated về false", () => {
    useAuthStore.getState().setAccount(mockAccount);
    useAuthStore.getState().setAccount(null);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });

  it("setLoading cập nhật isLoading", () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
  });

  it("setError cập nhật error", () => {
    useAuthStore.getState().setError("Invalid credentials");
    expect(useAuthStore.getState().error).toBe("Invalid credentials");
  });

  it("reset xóa toàn bộ state", () => {
    useAuthStore.getState().setAccount(mockAccount);
    useAuthStore.getState().setError("some error");
    useAuthStore.getState().reset();
    const { account, isAuthenticated, error } = useAuthStore.getState();
    expect(account).toBeNull();
    expect(isAuthenticated).toBe(false);
    expect(error).toBeNull();
  });
});
