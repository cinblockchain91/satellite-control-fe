const REFRESG_URL = "/api/auth/refresh";
const LOGIN_URL = "/login";

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

export async function authInterceptor(
  path: string,
  init: RequestInit,
  baseUrl: string,
  retry: (path: string, init: RequestInit) => Promise<Response>,
): Promise<Response> {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    credentials: "include",
  });
  if (res.status !== 401) return res;
  if (isRefreshing) {
    return new Promise((resolve) => {
      pendingRequests.push(() => resolve(retry(path, init)));
    });
  }
  isRefreshing = true;
  try {
    const refreshRes = await fetch(`${baseUrl}${REFRESG_URL}`, {
      method: "POST",
      credentials: "include",
    });
    if (!refreshRes.ok) {
      if (typeof window !== "undefined") {
        window.location.href = LOGIN_URL;
      }
      throw new Error("Session expired");
    }
    pendingRequests.forEach((cb) => cb());
    pendingRequests = [];
    return retry(path, init);
  } finally {
    isRefreshing = false;
  }
}
