"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/shadcn/form";
import Input from "@/components/ui/fields/Input";
import Button from "@/components/ui/Button";
import DatePicker from "@/components/ui/fields/DatePicker";
import DropZone from "@/components/ui/fields/DropZone";
import SelectField from "@/components/ui/fields/SelectField";
import { useUpdateMutation } from "@/hooks/queries";
import MediaField from "@/components/ui/fields/MediaField";

const fields = [
  { name: "firstName", label: "First Name", placeholder: "Enter first name" },
  { name: "lastName", label: "Last Name", placeholder: "Enter last name" },
  {
    name: "gender",
    label: "Gender",
    placeholder: "Select gender",
    type: "select",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
      { value: "rather not say", label: "Rather not say" },
    ],
  },
  {
    name: "dateOfBirth",
    label: "Date of Birth",
    type: "date",
    placeholder: "Select date of birth",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter email",
    type: "email",
  },
  {
    name: "phone",
    label: "Phone Number",
    placeholder: "Enter phone number",
    readOnly: true,
  },
];

export default function ProfileForm({ details }) {
  const updateMutation = useUpdateMutation({
    url: "/customers",
    handle: "profile",
    mutationOptions: {
      onSuccess: (data) => {
        console.log("Profile updated successfully", data);
      },
    },
    hasBinary: true,
  });

  const formSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    gender: z.string().min(1, "Gender is required"),
    dateOfBirth: z.string().nullable(),
    email: z
      .preprocess(
        (val) => (val === "" ? null : val),
        z.union([z.email(), z.null()])
      )
      .optional(),
    avatar: z.file().optional().nullable(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: details.firstName || "",
      lastName: details.lastName || "",
      dateOfBirth: details.dateOfBirth ?? null,
      gender: details.gender || "",
      phone: details.phone || "",
      email: details.email || "",
      avatar: null,
    },
  });

  console.log(form.formState.errors);

  async function onSubmit(values) {
    await updateMutation.mutateAsync({ values });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {/* Left side fields */}
        <div className="md:col-span-2 space-y-5 max-sm:text-center">
          {fields.map((field) => {
            if (field.type === "date") {
              return (
                <DatePicker
                  key={field.name}
                  control={form.control}
                  label={field.label}
                  name={field.name}
                />
              );
            }

            if (field.type === "select") {
              return (
                <SelectField
                  key={field.name}
                  onChange={(value) => form.setValue(field.name, value)}
                  label={field.label}
                  name={field.name}
                  options={field.options}
                  value={form.getValues(field.name)}
                  className="text-left"
                />
              );
            }

            return (
              <Input
                key={field.name}
                placeholder={field.placeholder}
                control={form.control}
                name={field.name}
                label={field.label}
                type={field.type || "text"}
                readOnly={field.readOnly}
                className="read-only:bg-gray-100"
              />
            );
          })}

          <Button
            type="submit"
            isLoading={updateMutation.isPending}
            className="mt-1"
          >
            Save Changes
          </Button>
        </div>

        {/* Avatar on right side */}
        <div className="flex flex-col items-center justify-start space-y-4 row-start-1 md:row-auto">
          <MediaField
            name="avatar"
            label="Avatar"
            shape="circle"
            shapeClass="w-48 h-48"
            initial={details?.avatar ? [details.avatar] : null}
            onChange={(file) => {
              form.setValue("avatar", file || null);
            }}
            showModal={false}
            createMedia={false}
          />
        </div>
      </form>
    </Form>
  );
}
