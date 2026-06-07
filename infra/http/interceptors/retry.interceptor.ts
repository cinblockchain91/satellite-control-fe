const MAX_RETRIES = 3;
const RETRYABLE_STATUSES = [408, 429, 500, 502, 503, 504];
function getDelay(attempt: number): number {
  return Math.min(1000 * Math.pow(2, attempt), 10_000);
}

function isRetryable(status: number): boolean {
  return RETRYABLE_STATUSES.includes(status);
}

function isNetworkError(error: unknown): boolean {
  return error instanceof TypeError && error.message === "Failed to fetch";
}

export async function retryInterceptor(
  fn: () => Promise<Response>,
  attempt = 0,
): Promise<Response> {
  try {
    const res = await fn();
    if (!res.ok && isRetryable(res.status) && attempt < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, getDelay(attempt)));
      return retryInterceptor(fn, attempt + 1);
    }
    return res;
  } catch (error) {
    if (isNetworkError(error) && attempt < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, getDelay(attempt)));
      return retryInterceptor(fn, attempt + 1);
    }
    throw error;
  }
}
