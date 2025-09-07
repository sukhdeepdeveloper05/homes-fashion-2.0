"use client";

import { QueryCache, QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

import { Toaster } from "@/components/shadcn/sonner";
import { toast } from "sonner";
import { ProgressProvider } from "@bprogress/next/app";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      let message = error?.message;

      if (!message) {
        message = query?.meta?.errorMessage ?? "An unexpected error occurred";
      }

      toast.error(message);
    },
  }),
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function Providers({ children }) {
  return (
    <>
      <ProgressProvider
        height="3px"
        color="var(--accent-primary)"
        options={{ showSpinner: false }}
        shallowRouting
      >
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toaster position="top-right" theme="light" richColors={true} />
      </ProgressProvider>
    </>
  );
}
