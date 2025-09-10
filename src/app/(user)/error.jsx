"use client"; // Error boundaries must be Client Components

import Button from "@/components/ui/Button";

export default function Error({ error }) {
  return (
    <div className="flex items-center justify-center flex-col gap-4 flex-1">
      <p className="text-xl font-semibold">
        {error.message || "Something went wrong"}
      </p>
      <Button onClick={() => window.location.reload()}>Reload</Button>
    </div>
  );
}
