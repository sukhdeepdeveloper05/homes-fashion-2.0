"use client";

import { useState } from "react";
import { Badge } from "@/components/shadcn/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/shadcn/dropdown-menu";
import { Check, Plus } from "lucide-react";
import clsx from "clsx";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.08, // delay between badges
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 },
};

export default function MultiSelectField({
  name,
  options = [],
  value = [],
  onChange,
  form,
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
}) {
  const [selectedItems, setSelectedItems] = useState(
    options.filter((o) => value.includes(o.value))
  );

  const handleSelect = (item, checked) => {
    let newItems;
    if (checked) {
      newItems = selectedItems.filter((s) => s.value !== item.value);
    } else {
      newItems = [...selectedItems, item];
    }
    setSelectedItems(newItems);
    onChange?.(newItems.map((i) => i.value));
    form?.trigger(name);
  };

  const handleRemove = (key) => {
    const newItems = selectedItems.filter((s) => s.value !== key);
    setSelectedItems(newItems);
    onChange?.(newItems.map((i) => i.value));
  };

  return (
    <div className={clsx("w-full flex flex-col gap-2", className)}>
      {label && (
        <label
          className={clsx(
            "data-[error=true]:text-destructive inline-flex items-center font-medium text-foreground",
            labelClass
          )}
          // data-error={!!errorMessage}
        >
          {label}
          {required && <span className="text-red-500 pl-0.5">*</span>}
        </label>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          className={clsx(
            "w-full px-4 py-3 border border-gray-300 bg-white text-base h-full rounded-md text-left aria-invalid:border-destructive",
            buttonClass
          )}
          // aria-invalid={!!errorMessage}
          disabled={disabled}
        >
          {selectedItems.length > 0 ? (
            <div className="flex gap-1 max-w-11/12">
              <motion.div
                className="flex flex-wrap gap-1"
                variants={containerVariants}
                initial="initial"
                animate="animate"
              >
                <AnimatePresence>
                  {selectedItems.map((item) => (
                    <motion.div
                      key={item.value}
                      variants={itemVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      transition={{ duration: 0.25 }}
                      layout
                    >
                      <Badge
                        className="flex items-center gap-1 rounded-sm bg-gray-100 text-gray-800 px-2 py-[3px] text-xs"
                        variant="secondary"
                      >
                        {item.label}
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(item.value);
                          }}
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <FiX className="ml-1 text-gray-500 hover:text-red-500" />
                        </span>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className={clsx("max-h-[300px] overflow-y-auto", dropdownClass)}
          align="start"
        >
          {options.map((opt) => {
            const isSelected = selectedItems.some((s) => s.value === opt.value);
            return (
              <DropdownMenuItem
                key={opt.value}
                onSelect={(e) => {
                  e.preventDefault();
                  handleSelect(opt, isSelected);
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="flex-1">{opt.label}</span>
                {isSelected && <Check className="h-4 w-4" />}
              </DropdownMenuItem>
            );
          })}

          {allowCreate && (
            <DropdownMenuItem
              key="__create__"
              onSelect={(e) => {
                e.preventDefault();
                onCreate();
              }}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Add new</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* {errorMessage && (
        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      )} */}
    </div>
  );
}
