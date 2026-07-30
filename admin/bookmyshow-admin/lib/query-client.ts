import { QueryClient } from "@tanstack/react-query";

// Single shared QueryClient config. Tuned for an admin dashboard:
// data doesn't need to be ultra-fresh, but should refetch on refocus.
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
        refetchOnWindowFocus: true,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  });
}
