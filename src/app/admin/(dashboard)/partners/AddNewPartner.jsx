"use client";

import SidebarModal from "@/components/ui/modals/SidebarModal";
import { FiLoader } from "react-icons/fi";
import { useUpdateMutation } from "@/hooks/queries";
import { useMemo } from "react";
import { useSidebarFormContext } from "@/store/sidebarFormContext";
import z from "zod";

export default function AddNewPartner() {
  const { isShown, close, initialData } = useSidebarFormContext();

  const isEdit = Boolean(initialData);

  const updatePartnerMutation = useUpdateMutation("partner", "/partners");

  const initialValues = useMemo(
    () => ({
      name: initialData?.name || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      country: initialData?.country || "",
      status: initialData?.status || "",
    }),
    [initialData]
  );

  const partnerSchema = z.object({
    name: z.string().nonempty({ error: "Name is required" }),
    email: z.string().nonempty({ error: "Email is required" }),
    phone: z
      .string()
      .max(10, { error: "Invalid phone number" })
      .nonempty({ error: "Phone is required" }),
    country: z.string().nonempty({ error: "Country is required" }),
    status: z.string().nonempty({ error: "Status is required" }),
  });

  async function handleSubmit(vals, form) {
    await updatePartnerMutation.mutateAsync({
      id: initialData?.id,
      vals,
    });
    form.reset();
    close();
  }

  const fields = [
    {
      name: "name",
      label: "Name",
      type: "text",
      placeholder: "Name",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Email",
    },
    {
      name: "phone",
      label: "Phone",
      type: "text",
      placeholder: "Phone",
    },
    {
      name: "country",
      label: "Country",
      type: "text",
      placeholder: "Country",
    },
    // {
    //   name: "status",
    //   label: "Status",
    //   type: "select",
    //   options: [...PARTNER_STATUSES],
    //   placeholder: "Select status",
    // },
  ];

  return (
    <SidebarModal
      open={isShown}
      onClose={close}
      title={`${isEdit ? "Edit" : "Add"} Product`}
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
