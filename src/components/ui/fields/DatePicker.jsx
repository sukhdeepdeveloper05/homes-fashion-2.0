"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import { format } from "date-fns";

import { Calendar } from "@/components/shadcn/calendar";
import { Label } from "@/components/shadcn/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shadcn/popover";
import { cn } from "@/lib/utils";
import formatDate from "@/utils/formatDate";

export default function DatePicker({ control, name, label }) {
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex flex-col gap-2 relative">
          {label && (
            <Label className="text-base" htmlFor={name}>
              {label}
            </Label>
          )}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                id={name}
                className={cn(
                  "w-full px-4 py-3 border border-gray-300 bg-white text-base rounded-md flex items-center justify-between text-left",
                  !field.value && "text-gray-400"
                )}
              >
                {field.value
                  ? formatDate(field.value, "en-IN", {})
                  : "dd/mm/yyyy"}
                <CalendarIcon className="w-5 h-5 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" side="bottom" align="center">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(date) => {
                  if (!date) {
                    setOpen(false);
                    return;
                  }
                  field.onChange(new Date(date));
                  setOpen(false); // close after selecting
                }}
                captionLayout="dropdown"
                // showOutsideDays
              />
            </PopoverContent>
          </Popover>
        </div>
      )}
    />
  );
}
