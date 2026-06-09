import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { retryInterceptor } from "./retry.interceptor";

describe("retryInterceptor", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("trả về response ngay nếu thành công", async () => {
    const fn = vi.fn().mockResolvedValue(new Response(null, { status: 200 }));
    const result = await retryInterceptor(fn);
    expect(result.status).toBe(200);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("không retry với status không nằm trong danh sách (404)", async () => {
    const fn = vi.fn().mockResolvedValue(new Response(null, { status: 404 }));
    const result = await retryInterceptor(fn);
    expect(result.status).toBe(404);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retry khi gặp status 500 và thành công ở lần thứ 3", async () => {
    const fn = vi
      .fn()
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValueOnce(new Response(null, { status: 500 }))
      .mockResolvedValue(new Response(null, { status: 200 }));

    const promise = retryInterceptor(fn);
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.status).toBe(200);
    expect(fn).toHaveBeenCalledTimes(3);
  });

  it("dừng sau 3 lần retry dù vẫn lỗi — tổng 4 lần gọi", async () => {
    const fn = vi.fn().mockResolvedValue(new Response(null, { status: 500 }));

    const promise = retryInterceptor(fn);
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.status).toBe(500);
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it("retry khi gặp network error (TypeError: Failed to fetch)", async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("Failed to fetch"))
      .mockResolvedValue(new Response(null, { status: 200 }));

    const promise = retryInterceptor(fn);
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.status).toBe(200);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("throw sau MAX_RETRIES khi network error liên tục", async () => {
    const fn = vi.fn().mockRejectedValue(new TypeError("Failed to fetch"));

    const promise = retryInterceptor(fn);
    const expectation = expect(promise).rejects.toThrow("Failed to fetch");

    await vi.runAllTimersAsync();
    await expectation;

    expect(fn).toHaveBeenCalledTimes(4);
  });
});
