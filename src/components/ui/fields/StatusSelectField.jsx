"use client";

import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { STATUS_BADGES as STATUS } from "@/config/Consts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import clsx from "clsx";
import { useEffect } from "react";

export default function StatusSelectField({
  name,
  options = [],
  value,
  hideOptions,
  onChange,
  placeholder = "Select",
  disabled = false,
  size = "md",
  className = "",
  label,
  labelClass = "",
  required = false,
  allowCreate = false,
  onCreate = () => {},
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selected, setSelected] = useState(
    options.find((opt) => String(opt.value) === String(value))
  );

  useEffect(() => {
    setSelected(options.find((opt) => String(opt.value) === String(value)));
  }, [value]);

  const handleSelectionChange = async (newValue) => {
    if (newValue === "__create__") {
      onCreate();
      return;
    }

    setIsLoading(true);
    const parsedValue = isNaN(Number(newValue))
      ? String(newValue)
      : Number(newValue);

    setSelected(options.find((opt) => String(opt.value) === String(newValue)));
    onChange && (await onChange(parsedValue !== "null" ? parsedValue : null));
    setIsLoading(false);
  };

  return (
    <div className={`w-full ${className}`} key={name}>
      {label && (
        <label
          htmlFor={name}
          className={clsx(
            "mb-2 inline-flex items-center font-medium text-foreground",
            labelClass
          )}
        >
          {label}
          {required && <span className="text-red-500 pl-0.5">*</span>}
        </label>
      )}

      <Select
        name={name}
        value={String(selected?.value)}
        onValueChange={handleSelectionChange}
        disabled={disabled || hideOptions}
      >
        <SelectTrigger
          className={clsx(
            "w-fit uppercase text-xs font-semibold truncate border-0 py-1.5 data-[options-hidden=true]:pointer-events-none disabled:opacity-100",
            STATUS[selected?.key ?? ""],
            { "opacity-50 pointer-events-none": isLoading }
          )}
          data-loading={isLoading}
          hideIcon={true}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </SelectItem>
          ))}

          {allowCreate && (
            <SelectItem key="__create__" value="__create__">
              <div className="flex items-center gap-2">
                <FiPlus className="h-4 w-4 shrink-0" />
                <span>Add new</span>
              </div>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
