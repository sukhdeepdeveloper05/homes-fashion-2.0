"use client";

import SidebarModal from "@/components/ui/modals/SidebarModal";
import { FiLoader } from "react-icons/fi";
import { useCreateMutation } from "@/hooks/queries";
import { useEffect, useMemo } from "react";
import { useSidebarFormContext } from "@/store/sidebarFormContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

export default function AddNewCollection() {
  const { initialData, isShown, close } = useSidebarFormContext();

  const createCollectionMutation = useCreateMutation(
    "collection",
    "/collections"
  );

  const initialValues = {
    title: initialData?.title || "",
    description: initialData?.description || "",
    tags: initialData?.tags || "",
    featuredImage: initialData?.featuredImage || "",
  };

  const collectionSchema = z.object({
    title: z.string().nonempty({ error: "Collection Title is required" }),
    description: z.string().nonempty({ error: "Description is required" }),
    tags: z.string().optional(),
    featuredImage: z.string().optional(),
  });

  async function handleSubmit(vals, form) {
    const cleanedVals = {
      ...vals,
      tags: vals.tags.split(/\s*,\s*/).filter(Boolean),
    };
    try {
      await createCollectionMutation.mutateAsync({ values: cleanedVals });
      form.reset();
      close();
    } catch (error) {
      console.log(error.message);
    }
  }

  const fields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Collection Title",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Description",
    },

    {
      name: "tags",
      label: "Tags",
      type: "text",
      placeholder: "Tags",
    },
    {
      name: "featuredImage",
      label: "Featured Image",
      type: "dropzone",
      placeholder: "Select Featured Image",
      initial: [initialData?.featuredImage],
      onChange: (file, form) => {
        form.setValue("featuredImage", file);
      },
    },
  ];

  return (
    <SidebarModal
      open={isShown}
      onClose={close}
      title={"Add Collection"}
      list={fields}
      defaultValues={initialValues}
      schema={collectionSchema}
      submitLabel={"Add"}
      loading={createCollectionMutation.isPending}
      onSubmit={handleSubmit}
      key={initialData?.id ?? "new"}
    >
      {createCollectionMutation.isPending && (
        <div className="flex items-center justify-center p-4">
          <FiLoader className="animate-spin text-2xl text-foreground-primary" />
        </div>
      )}
    </SidebarModal>
  );
}
