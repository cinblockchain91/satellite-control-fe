import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

type AuthInterceptorFn = (
  path: string,
  init: RequestInit,
  baseUrl: string,
  retry: (path: string, init: RequestInit) => Promise<Response>,
) => Promise<Response>;

function makeResponse(status: number): Response {
  return { status, ok: status >= 200 && status < 300 } as Response;
}

describe("authInterceptor", () => {
  let authInterceptor: AuthInterceptorFn;

  beforeEach(async () => {
    vi.resetModules();
    const module = await import("./auth.interceptor");
    authInterceptor = module.authInterceptor;
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns response immediately when status is not 401", async () => {
    vi.mocked(fetch).mockResolvedValue(makeResponse(200));
    const retry = vi.fn();

    const result = await authInterceptor(
      "/api/data",
      {},
      "https://api.example.com",
      retry,
    );

    expect(result.status).toBe(200);
    expect(retry).not.toHaveBeenCalled();
  });

  it("retries original request after successful token refresh", async () => {
    const retryResponse = makeResponse(200);
    vi.mocked(fetch)
      .mockResolvedValueOnce(makeResponse(401))
      .mockResolvedValueOnce(makeResponse(200));
    const retry = vi.fn().mockResolvedValue(retryResponse);

    const result = await authInterceptor(
      "/api/data",
      {},
      "https://api.example.com",
      retry,
    );

    expect(result).toBe(retryResponse);
    expect(retry).toHaveBeenCalledWith("/api/data", {});
  });

  it("throws 'Session expired' when refresh request fails", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(makeResponse(401))
      .mockResolvedValueOnce(makeResponse(401));
    const retry = vi.fn();

    await expect(
      authInterceptor("/api/data", {}, "https://api.example.com", retry),
    ).rejects.toThrow("Session expired");

    expect(retry).not.toHaveBeenCalled();
  });

  it("queues concurrent 401 requests and retries all after refresh", async () => {
    let resolveRefresh!: (v: Response) => void;

    vi.mocked(fetch)
      .mockResolvedValueOnce(makeResponse(401))
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRefresh = resolve;
          }),
      )
      .mockResolvedValueOnce(makeResponse(401));

    const retry = vi.fn().mockResolvedValue(makeResponse(200));

    const promise1 = authInterceptor(
      "/api/data1",
      {},
      "https://api.example.com",
      retry,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    const promise2 = authInterceptor(
      "/api/data2",
      {},
      "https://api.example.com",
      retry,
    );
    await new Promise((resolve) => setTimeout(resolve, 0));

    resolveRefresh(makeResponse(200));
    await Promise.all([promise1, promise2]);

    expect(retry).toHaveBeenCalledTimes(2);
  });
});
