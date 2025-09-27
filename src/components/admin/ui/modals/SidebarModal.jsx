"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/shadcn/sheet";
import { Form } from "@/components/shadcn/form";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/fields/Input";
import SelectField from "@/components/ui/fields/SelectField";
import Checkbox from "@/components/ui/fields/Checkbox";
import MultiSelectField from "@/components/ui/fields/MultiSelectField";
import DropZone from "@/components/ui/fields/DropZone";
import TextArea from "@/components/ui/fields/TextArea";
import SearchField from "@/components/ui/fields/SearchField";
import DatePicker from "@/components/ui/fields/DatePicker";
import clsx from "clsx";
import { FiX } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import MediaField from "@/components/ui/fields/MediaField";
import { cn } from "@/lib/utils";

const componentMap = {
  select: ({ multiple, ...props }) =>
    multiple ? <MultiSelectField {...props} /> : <SelectField {...props} />,
  date: (props) => <DatePicker {...props} />,
  checkbox: (props) => <Checkbox {...props} />,
  dropzone: (props) => <MediaField {...props} />,
  button: ({ label, onClick, ...props }) => (
    <Button onClick={onClick} variant="primary" {...props}>
      {label}
    </Button>
  ),
  textarea: (props) => <TextArea {...props} />,
  search: (props) => <SearchField {...props} />,
  // default fallback
  default: (props) => <Input type="password" {...props} />,
};

export default function SidebarModal({
  open,
  onClose,
  title = "",
  list = [],
  defaultValues = {},
  schema,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  onSubmit,
  onInvalid = () => {},
  loading = false,
  hideSubmit = false,
  footerText = "",
  width = "sm:max-w-lg",
  className = "",
  children,
}) {
  const initialValues = useMemo(
    () => ({
      ...defaultValues,
    }),
    [defaultValues]
  );

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues]);

  const form = useForm({
    resolver: zodResolver(schema),
    initialValues,
  });

  const shapeItem = (item, idx) => {
    const Component = componentMap[item.type] ?? componentMap.default;

    const value = form.watch(item.name);

    return (
      <Component
        key={idx}
        value={value}
        form={form}
        control={form.control}
        {...item}
        {...(item?.onChange && {
          onChange: (...vals) => item.onChange(...vals, form),
        })}
      />
    );
  };

  console.log(form.getValues());

  return (
    <Sheet open={open} onOpenChange={(isOpen) => !isOpen && onClose?.()}>
      <SheetContent
        side="right"
        className={cn(
          "flex flex-col gap-0 h-full shadow-xl data-[state=open]:duration-200",
          width,
          className
        )}
        aria-describedby={undefined}
        overlayClassName="overlay"
        showCloseButton={false}
      >
        <SheetHeader className="border-b border-gray-300 text-large flex-row justify-between items-center">
          <SheetTitle>{title}</SheetTitle>
          <SheetClose asChild>
            <button type="button" className="p-1">
              <FiX size={20} />
            </button>
          </SheetClose>
        </SheetHeader>

        <div className="flex-1 flex flex-col overflow-y-auto">
          <div className="shrink-0 bg-white px-4 py-5 h-full">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(
                  (data) => onSubmit(data, form),
                  onInvalid
                )}
                className="flex flex-col gap-5 h-full"
              >
                {list.map(shapeItem)}
                {children}
              </form>
            </Form>
          </div>
        </div>

        <SheetFooter className="border-t border-gray-300 grid grid-cols-2 gap-4">
          {!hideSubmit && (
            <Button
              variant="primary"
              isLoading={loading}
              disabled={loading}
              type="submit"
              onClick={form.handleSubmit(
                (data) => onSubmit(data, form),
                onInvalid
              )}
            >
              {submitLabel}
            </Button>
          )}
          <Button variant="foreground" appearance="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
