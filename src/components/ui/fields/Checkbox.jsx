"use client";

import { Checkbox as SCheckbox } from "@/components/shadcn/checkbox";
import { cn } from "@/lib/utils";

export default function Checkbox({
  title,
  className = "",
  inputClass = "",
  checked = false,
  disabled = false,
  onChange,
  id = `chk-${title ?? "checkbox"}`,
  name = "checkbox",
  ref,
  ...rest
}) {
  return (
    <div className={cn({ "flex items-center gap-2": title }, className)}>
      <SCheckbox
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onCheckedChange={(val) => {
          onChange?.(!!val);
        }}
        ref={ref}
        className={cn(
          "h-5 w-5 rounded border border-gray-300 flex-shrink-0 transition focus:outline-none shadow-none bg-white",
          inputClass
        )}
        {...rest}
      />

      {title && (
        <label
          htmlFor={id}
          className={cn(
            "font-medium cursor-pointer select-none",
            disabled ? "text-gray-400" : "text-gray-700"
          )}
        >
          {title}
        </label>
      )}
    </div>
  );
}
