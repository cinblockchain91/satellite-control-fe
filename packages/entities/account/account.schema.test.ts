import { describe, it, expect } from "vitest";
import { AccountSchema } from "./account.schema";

const validAccount = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  username: "nguyenvanan",
  email: "an@example.com",
  role: "admin" as const,
  fullName: "Nguyen Van An",
  avatarUrl: "https://example.com/avatar.png",
  lastLoginAt: "2024-01-01T00:00:00Z",
  createdAt: "2024-01-01T00:00:00Z",
};

describe("AccountSchema", () => {
  it("parse thành công với data hợp lệ", () => {
    const result = AccountSchema.safeParse(validAccount);
    expect(result.success).toBe(true);
  });

  it("avatarUrl là optional", () => {
    const { avatarUrl, ...withoutAvatar } = validAccount;
    const result = AccountSchema.safeParse(withoutAvatar);
    expect(result.success).toBe(true);
  });

  it("id phải là UUID hợp lệ", () => {
    const result = AccountSchema.safeParse({
      ...validAccount,
      id: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("email phải đúng format", () => {
    const result = AccountSchema.safeParse({
      ...validAccount,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("username tối thiểu 3 ký tự", () => {
    const result = AccountSchema.safeParse({ ...validAccount, username: "ab" });
    expect(result.success).toBe(false);
  });

  it("role chỉ chấp nhận admin | engineer | viewer", () => {
    const result = AccountSchema.safeParse({
      ...validAccount,
      role: "superadmin",
    });
    expect(result.success).toBe(false);
  });
});
