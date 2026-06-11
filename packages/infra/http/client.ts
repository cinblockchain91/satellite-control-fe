import {
  authInterceptor,
  type AuthInterceptorOptions,
} from "./interceptors/token-refresh.interceptor";
import { retryInterceptor } from "./interceptors/retry.interceptor";

export interface HttpClient {
  get<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  put<T>(path: string, body: unknown): Promise<T>;
  patch<T>(path: string, body: unknown): Promise<T>;
  delete(path: string): Promise<void>;
}

export interface HttpClientOptions extends AuthInterceptorOptions {
  credentials?: RequestCredentials;
}

export function createHttpClient(
  baseUrl: string,
  options: HttpClientOptions = {},
): HttpClient {
  const { credentials = "include", onUnauthorized } = options;

  async function request<T>(path: string, init?: RequestInit): Promise<T> {
    const fetchInit: RequestInit = {
      ...init,
      credentials,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    };

    const res = await retryInterceptor(() =>
      authInterceptor(
        path,
        fetchInit,
        baseUrl,
        (p, i) => retryInterceptor(() => fetch(`${baseUrl}${p}`, i)),
        { ...(onUnauthorized !== undefined && { onUnauthorized }) },
      ),
    );

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(error.message ?? res.statusText);
    }

    if (res.status === 204) return undefined as T;
    return res.json() as Promise<T>;
  }

  return {
    get: (path) => request(path, { method: "GET" }),
    post: (path, body) =>
      request(path, { method: "POST", body: JSON.stringify(body) }),
    put: (path, body) =>
      request(path, { method: "PUT", body: JSON.stringify(body) }),
    patch: (path, body) =>
      request(path, { method: "PATCH", body: JSON.stringify(body) }),
    delete: (path) => request(path, { method: "DELETE" }),
  };
}
