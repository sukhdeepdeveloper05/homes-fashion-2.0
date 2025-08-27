"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/shadcn/form";
import clsx from "clsx";
import { Textarea } from "@/components/shadcn/textarea";

const sizeClasses = {
  small: "px-3 py-1.5 text-sm",
  medium: "px-3.5 py-3 text-base",
  large: "px-5 py-3 text-lg",
};

export default function TextArea({
  control, // react-hook-form form instance
  name,
  size = "medium",
  label,
  description,
  className = "",
  placeholder = "",
  required = false,
  ...rest
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full flex flex-col gap-2">
          {label && (
            <FormLabel htmlFor={name}>
              {label}
              {required && <span className="text-red-500 pl-0.5">*</span>}
            </FormLabel>
          )}

          {description && <FormDescription>{description}</FormDescription>}

          <FormControl>
            <Textarea
              {...field}
              {...rest}
              id={name}
              placeholder={placeholder}
              className={clsx("min-h-[120px]", sizeClasses[size], className)}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
