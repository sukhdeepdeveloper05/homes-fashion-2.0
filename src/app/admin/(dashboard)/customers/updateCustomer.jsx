"use client";

import SidebarModal from "@/components/admin/ui/modals/SidebarModal";
import { FiLoader } from "react-icons/fi";
import { GENDER_OPTIONS } from "@/config/Consts";
import { useUpdateMutation } from "@/hooks/queries";
import { useSidebarFormContext } from "@/store/sidebarFormContext";
import z from "zod";
import { useMemo } from "react";

const customerSchema = z.object({
  firstName: z.string().nonempty({ error: "First name is required" }),
  lastName: z.string().optional(),
  gender: z.string().nonempty({ error: "Gender is required" }),
  dateOfBirth: z.date().optional(),
  email: z.email({ error: "Invalid email" }),
  avatar: z.string().optional(),
});

export default function UpdateCustomer() {
  const { initialData, isShown, close } = useSidebarFormContext();

  const updateCustomerMutation = useUpdateMutation({
    handle: "customer",
    url: "/customers",
  });

  const initialValues = useMemo(
    () => ({
      firstName: initialData?.firstName || "",
      lastName: initialData?.lastName || "",
      gender: initialData?.gender || "",
      dateOfBirth: initialData?.dateOfBirth
        ? new Date(initialData?.dateOfBirth)
        : null,
      email: initialData?.email || "",
      avatar: initialData?.avatar?.id || null,
    }),
    [initialData]
  );

  async function submitHandler(vals, form) {
    await updateCustomerMutation.mutateAsync({
      id: initialData.id,
      values: vals,
    });
    form.reset();
    close();
  }

  const fields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      required: true,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      required: true,
      options: GENDER_OPTIONS,
    },
    {
      name: "dateOfBirth",
      label: "Date of Birth",
      type: "date",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
    },
    {
      name: "avatar",
      label: "Avatar",
      type: "dropzone",
      placeholder: "Select an Avatar",
      initial: initialData?.avatar && [initialData?.avatar],
      onChange: (files, form) => {
        form.setValue("avatar", files);
      },
    },
  ];

  return (
    <SidebarModal
      key={initialData?.id}
      open={isShown}
      onClose={close}
      title={`Edit Customer`}
      list={fields}
      defaultValues={initialValues}
      schema={customerSchema}
      submitLabel={"Update"}
      loading={updateCustomerMutation.isPending}
      onSubmit={submitHandler}
    >
      {updateCustomerMutation.isPending && (
        <div className="flex items-center justify-center p-4">
          <FiLoader className="animate-spin text-2xl text-foreground-primary" />
        </div>
      )}
    </SidebarModal>
  );
}
