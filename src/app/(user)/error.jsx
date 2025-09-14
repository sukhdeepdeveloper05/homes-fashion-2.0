"use client";

import Button from "@/components/ui/Button";
import { ErrorProvider, useError } from "@/store/error";
import { useEffect } from "react";

export default function Error({ error, reset }) {
  const isServerError = !!error?.digest;
  const { setIsError } = useError();
  // console.log(error);

  useEffect(() => {
    setIsError(true);
    return () => {
      setIsError(false);
    };
  }, [setIsError]);

  return (
    <div className="container flex items-center justify-center flex-col gap-4 flex-1 p-18">
      {isServerError ? (
        <p className="text-xl font-semibold">
          We’re having some issues. Please try again later.
        </p>
      ) : (
        <>
          <p className="text-xl font-semibold">
            {error?.message || "Something went wrong"}
          </p>
        </>
      )}
      {error?.button ?? (
        <Button onClick={() => window.location.reload()}>Reload</Button>
      )}
    </div>
  );
}
