"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { FiPlus } from "react-icons/fi";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function SelectField({
  name,
  options = [],
  hideOptions = false,
  canEmpty = false,
  value,
  onChange,
  placeholder = "Select",
  disabled = false,
  className = "",
  buttonClass = "",
  dropdownClass = "",
  label,
  labelClass = "",
  required = false,
  allowCreate = false,
  onCreate = () => {},
  form,
}) {
  const [selected, setSelected] = useState(
    options.find((opt) => String(opt.value) === String(value))
  );

  useEffect(() => {
    setSelected(options.find((opt) => String(opt.value) === String(value)));
  }, [value]);

  const handleSelectionChange = (newValue) => {
    if (newValue === "__create__") {
      onCreate();
      return;
    }

    const parsedValue = isNaN(Number(newValue))
      ? String(newValue)
      : Number(newValue);

    if (form) {
      form.setValue(name, parsedValue !== "null" ? parsedValue : "");
    }

    setSelected(
      options.find((opt) => String(opt.value) === String(newValue)) ?? undefined
    );
    onChange?.(parsedValue !== "null" ? parsedValue : "");
  };

  return (
    <div className={clsx("w-full", className)} key={name}>
      {label && (
        <label
          className={clsx(
            "mb-2 inline-flex items-center font-medium text-foreground",
            labelClass
          )}
          htmlFor={name}
        >
          {label}
          {required && <span className="text-red-500 pl-0.5">*</span>}
        </label>
      )}

      <Select
        name={name}
        value={String(selected?.value)}
        onValueChange={handleSelectionChange}
        disabled={hideOptions || disabled}
      >
        <SelectTrigger
          id={name}
          className={clsx(
            "w-full px-4 py-3 border border-gray-300 bg-white text-base h-full",
            buttonClass
          )}
        >
          <SelectValue asChild={true}>
            <span
              data-placeholder={selected === undefined}
              className="data-[placeholder=true]:text-muted-foreground"
            >
              {selected?.label ?? placeholder}
            </span>
          </SelectValue>
        </SelectTrigger>

        <SelectContent
          className={clsx("border border-gray-100 bg-white", dropdownClass)}
        >
          {options.map((opt) => (
            <SelectItem
              key={String(opt.label)}
              value={String(opt.value)}
              className="py-2 px-4 rounded-sm cursor-pointer"
            >
              {opt.label}
            </SelectItem>
          ))}

          {allowCreate && (
            <SelectItem
              key="__create__"
              value="__create__"
              className="flex items-center gap-2 cursor-pointer py-2 px-4"
            >
              <FiPlus className="h-4 w-4 shrink-0" />
              <span>Add new</span>
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
