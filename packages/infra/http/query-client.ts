import { QueryClient } from "@tanstack/react-query";

export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: (failureCount, error) => {
          if ((error as { status?: number }).status === 404) return false;
          return failureCount < 3;
        },
      },
    },
  });
}
