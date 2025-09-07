"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/shadcn/form";
import { Input as ShadcnInput } from "@/components/shadcn/input";
import { cn } from "@/lib/utils";

export default function Input({
  name,
  control,
  type = "text",
  label,
  description,
  required,
  className,
  beforeContent,
  ...rest
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full flex flex-col gap-2">
          {label && (
            <FormLabel>
              {label} {required && <span className="text-red-500">*</span>}
            </FormLabel>
          )}

          <div className="relative flex">
            {beforeContent && beforeContent}
            <FormControl>
              <ShadcnInput
                {...field}
                {...rest}
                type={isPassword && show ? "text" : type}
                className={cn(
                  "w-full rounded-md border focus:outline-none transition px-3.5 py-3 text-base [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
                  isPassword && "pr-10",
                  className
                )}
              />
            </FormControl>
            {isPassword && (
              <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 text-foreground-secondary"
                tabIndex={-1}
              >
                {show ? (
                  <FiEye className="w-4 h-4" />
                ) : (
                  <FiEyeOff className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
