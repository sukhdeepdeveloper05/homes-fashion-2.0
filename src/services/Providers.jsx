"use client";

import { QueryCache, QueryClientProvider } from "@tanstack/react-query";
import { QueryClient } from "@tanstack/react-query";

import { Toaster } from "@/components/shadcn/sonner";
import { toast } from "sonner";
import NextTopLoader from "nextjs-toploader";

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
      <NextTopLoader
        color="var(--accent-primary)"
        initialPosition={0.08}
        crawlSpeed={50}
        height={3}
        crawl={true}
        showSpinner={false}
        easing="ease"
        speed={200}
        shadow="0 0 10px var(--accent-primary),0 0 5px var(--accent-primary)"
        zIndex={1600}
      />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      <Toaster position="top-right" theme="light" richColors={true} />
    </>
  );
}
