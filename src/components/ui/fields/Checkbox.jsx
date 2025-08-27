"use client";

import { forwardRef, useState } from "react";
import { Checkbox as SCheckbox } from "@/components/shadcn/checkbox";
import clsx from "clsx";

export default forwardRef(function Checkbox(
  {
    title,
    className = "",
    inputClass = "",
    checked = false,
    disabled = false,
    onChange,
    id = `chk-${title ?? "checkbox"}`,
    name = "checkbox",
    ...rest
  },
  ref
) {
  const [isChecked, setIsChecked] = useState(checked);

  return (
    <div className={clsx({ "flex items-center gap-2": title }, className)}>
      <SCheckbox
        id={id}
        name={name}
        checked={isChecked}
        disabled={disabled}
        onCheckedChange={(val) => {
          setIsChecked(!!val);
          onChange?.(!!val);
        }}
        ref={ref}
        className={clsx(
          "h-5 w-5 rounded border border-gray-300 flex-shrink-0 transition focus:outline-none shadow-none",
          inputClass
        )}
        {...rest}
      />

      {title && (
        <label
          htmlFor={id}
          className={clsx(
            "font-medium cursor-pointer select-none",
            disabled ? "text-gray-400" : "text-gray-700"
          )}
        >
          {title}
        </label>
      )}
    </div>
  );
});
