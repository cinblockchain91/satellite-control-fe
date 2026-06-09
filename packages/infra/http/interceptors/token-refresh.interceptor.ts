const REFRESH_URL = "/api/auth/refresh";

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

export interface AuthInterceptorOptions {
  onUnauthorized?: () => void;
}

export async function authInterceptor(
  path: string,
  init: RequestInit,
  baseUrl: string,
  retry: (path: string, init: RequestInit) => Promise<Response>,
  options: AuthInterceptorOptions = {},
): Promise<Response> {
  const res = await fetch(`${baseUrl}${path}`, init);
  if (res.status !== 401) return res;

  if (isRefreshing) {
    return new Promise((resolve) => {
      pendingRequests.push(() => resolve(retry(path, init)));
    });
  }

  isRefreshing = true;
  try {
    const refreshRes = await fetch(`${baseUrl}${REFRESH_URL}`, {
      method: "POST",
      ...(init.credentials !== undefined && { credentials: init.credentials }),
    });

    if (!refreshRes.ok) {
      options.onUnauthorized?.();
      throw new Error("Session expired");
    }

    pendingRequests.forEach((cb) => cb());
    pendingRequests = [];
    return retry(path, init);
  } finally {
    isRefreshing = false;
  }
}
