"use client";

import SidebarModal from "@/components/admin/ui/modals/SidebarModal";
import { FiLoader } from "react-icons/fi";
import { useCreateMutation, useUpdateMutation } from "@/hooks/queries";
import { useMemo } from "react";
import { useSidebarFormContext } from "@/store/sidebarFormContext";
import z from "zod";

export default function AddNewPartner() {
  const { isShown, close, initialData } = useSidebarFormContext();

  const isEdit = Boolean(initialData);

  const createPartnerMutation = useCreateMutation({
    handle: "partner",
    url: "/partners",
    hasBinary: true,
  });

  const updatePartnerMutation = useUpdateMutation({
    handle: "partner",
    url: "/partners",
    hasBinary: true,
  });

  const initialValues = useMemo(
    () => ({
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      email: initialData?.email || "",
      gender: initialData?.gender || "",
      dateOfBirth: initialData?.dateOfBirth
        ? new Date(initialData?.dateOfBirth)
        : null,
      phone: initialData?.phone || "",
      avatar: initialData?.avatar?.id || null,
    }),
    [initialData]
  );

  const partnerSchema = z.object({
    firstName: z.string().nonempty({ error: "First Name is required" }),
    lastName: z.string().optional(),
    email: z.string().nonempty({ error: "Email is required" }),
    gender: z.string().nullable(),
    dateOfBirth: z.date().optional(),
    phone: z.preprocess(
      (val) => {
        if (typeof val !== "string") return val;
        const trimmed = val.trim();
        return trimmed.startsWith("+91") ? trimmed : `+91${trimmed}`;
      },
      z
        .string()
        .nonempty({ message: "Phone is required" })
        .regex(/^\+91\d{10}$/, {
          message: "Must be a valid 10-digit Indian phone number",
        })
    ),
    avatar: z.union([z.string(), z.instanceof(File)]).optional(),
  });

  async function handleSubmit(vals, form) {
    console.log("create partner", vals);
    if (isEdit) {
      await updatePartnerMutation.mutateAsync({
        id: initialData?.id,
        values: vals,
      });
    } else {
      await createPartnerMutation.mutateAsync({
        values: vals,
      });
    }
    form.reset();
    close();
  }

  const fields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "First Name",
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Last Name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Email",
    },
    {
      name: "gender",
      label: "Gender",
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
      placeholder: "Date of Birth",
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      placeholder: "Phone",
    },
    {
      name: "avatar",
      label: "Avatar",
      type: "dropzone",
      placeholder: "Select an Avatar",
      createMedia: false,
      initial: initialData?.avatar && [initialData?.avatar],
      onChange: (files, form) => {
        files && form.setValue("avatar", files[0]);
      },
    },
  ];

  return (
    <SidebarModal
      open={isShown}
      onClose={close}
      title={`${isEdit ? "Edit" : "Add"} Partner`}
      list={fields}
      defaultValues={initialValues}
      schema={partnerSchema}
      submitLabel={isEdit ? "Update" : "Add"}
      loading={updatePartnerMutation.isPending}
      onSubmit={handleSubmit}
    >
      {updatePartnerMutation.isPending && (
        <div className="flex items-center justify-center p-4">
          <FiLoader className="animate-spin text-2xl text-foreground-primary" />
        </div>
      )}
    </SidebarModal>
  );
}
