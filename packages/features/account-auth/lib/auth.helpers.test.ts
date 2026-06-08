import { describe, it, expect } from "vitest";
import { hasPermission, getDisplayName } from "./auth.helpers";

describe("hasPermission", () => {
  it("admin có quyền truy cập tất cả roles", () => {
    expect(hasPermission("admin", "admin")).toBe(true);
    expect(hasPermission("admin", "engineer")).toBe(true);
    expect(hasPermission("admin", "viewer")).toBe(true);
  });

  it("engineer không có quyền admin", () => {
    expect(hasPermission("engineer", "admin")).toBe(false);
  });

  it("viewer chỉ có quyền viewer", () => {
    expect(hasPermission("viewer", "engineer")).toBe(false);
    expect(hasPermission("viewer", "viewer")).toBe(true);
  });
});

describe("getDisplayName", () => {
  it("trả về tên cuối trong chuỗi họ tên", () => {
    expect(getDisplayName("Nguyen Van An")).toBe("An");
  });

  it("trả về nguyên chuỗi nếu chỉ có một từ", () => {
    expect(getDisplayName("An")).toBe("An");
  });
});
