"use client";

import SidebarModal from "@/components/admin/ui/modals/SidebarModal";
import { FiLoader } from "react-icons/fi";
import {
  useCreateMutation,
  useListQuery,
  useUpdateMutation,
} from "@/hooks/queries";
import { useMemo } from "react";
import { useSidebarFormContext } from "@/store/sidebarFormContext";
import z from "zod";

export default function AddNewProduct() {
  const { initialData, setInitialData, close, isShown } =
    useSidebarFormContext();

  const isEdit = Boolean(initialData);

  const { data: { collections = [] } = {} } = useListQuery({
    handle: "collections",
    url: "/collections",
    queryKey: ["collections"],
  });
  const { data: { categories = [] } = {} } = useListQuery({
    handle: "categories",
    url: "/categories",
    queryKey: ["categories"],
  });

  const createProductMutation = useCreateMutation({
    handle: "product",
    url: "/products",
  });
  const updateProductMutation = useUpdateMutation({
    handle: "product",
    url: "/products",
  });

  const initialValues = useMemo(
    () => ({
      title: initialData?.title || "",
      description: initialData?.description || "",
      price: initialData?.price || "",
      priceCompare: initialData?.priceCompare || "",
      maxQuantityPerOrder: initialData?.maxQuantityPerOrder || "",
      tags: initialData?.tags
        ? initialData?.tags.length >= 1
          ? initialData?.tags.join(", ")
          : "N/A"
        : "",
      category: initialData?.category?.id || "",
      collectionId: initialData?.collections
        ? initialData?.collections.map((c) => c.id)
        : [],
      available: initialData?.available ?? true,
      status: initialData?.status || "active",
      featuredImage: initialData?.featuredImage?.id || null,
      media: initialData?.media ? initialData?.media.map((m) => m.id) : [],
    }),
    [initialData]
  );

  const productSchema = z.object({
    title: z.string().nonempty({ error: "Product Title is required" }),
    description: z.string().nonempty({ error: "Description is required" }),
    price: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val))
      .refine((val) => val >= 1, {
        message: "Price is required",
      }),
    priceCompare: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val))
      .nullable()
      .optional(),
    maxQuantityPerOrder: z.preprocess(
      (val) => (val === "" ? null : val),
      z.union([z.string(), z.number(), z.null()]).optional()
    ),
    tags: z.string().optional(),
    available: z.preprocess((val) => {
      if (typeof val === "string") {
        return val.toLowerCase() === "true"; // "true" → true, "false" → false
      }
      return Boolean(val);
    }, z.boolean()),
    status: z.string(),
    collectionId: z.array(z.string().nonempty()).optional(),
    category: z.preprocess(
      (val) => null,
      z.union([z.string(), z.null()]).optional()
    ),

    featuredImage: z.string().nullable().optional(),
    media: z.array(z.string().nonempty()).optional(),
  });

  async function onSubmit(vals, form) {
    console.log(vals);
    const cleanedVals = {
      ...vals,
      tags: vals.tags.split(/\s*,\s*/).filter(Boolean),
      available: Boolean(vals.available),
    };
    try {
      if (isEdit) {
        await updateProductMutation.mutateAsync({
          id: initialData.id,
          values: cleanedVals,
        });
      } else {
        await createProductMutation.mutateAsync({ values: cleanedVals });
      }
      form.reset();
      close();
      setInitialData(null);
    } catch (error) {
      console.log(error.message);
    }
  }

  const fields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Product Title",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Description",
    },
    { name: "price", label: "Price", type: "number", placeholder: "Price" },
    {
      name: "priceCompare",
      label: "Compare At Price",
      type: "number",
      placeholder: "Compare At Price",
    },
    {
      name: "maxQuantityPerOrder",
      label: "Max Quantity Per Order",
      type: "number",
      placeholder: "Max Quantity Per Order",
    },
    { name: "tags", label: "Tags", type: "text", placeholder: "Tags" },
    {
      name: "category",
      label: "Category",
      type: "select",
      placeholder: "Category",
      options: categories.map((c) => ({ value: c?.id, label: c?.title })),
      value: initialValues.category,
    },
    {
      name: "collectionId",
      label: "Collections",
      type: "select",
      multiple: true,
      options: collections.map((c) => ({ value: c?.id, label: c?.title })),
      value: initialValues.collectionId,
      onChange: (vals, form) => form.setValue("collectionId", vals),
      placeholder: "Collections",
    },
    {
      name: "available",
      label: "Availability",
      type: "select",
      options: [
        { value: true, label: "In Stock" },
        { value: false, label: "Out of Stock" },
      ],
      value: initialValues.available,
      placeholder: "Availability",
    },
    {
      name: "status",
      label: "Status",
      type: "select",
      options: [
        { value: "active", label: "Active" },
        { value: "draft", label: "Draft" },
      ],
      value: initialValues.status,
      placeholder: "Select status",
    },
    {
      name: "featuredImage",
      label: "Featured Image",
      type: "dropzone",
      placeholder: "Select Featured Image",
      value: initialValues.featuredImage,
      initial: [initialData?.featuredImage],
      onChange: (file, form) => {
        form.setValue("featuredImage", file);
      },
    },
    {
      name: "media",
      label: "Media",
      type: "dropzone",
      placeholder: "Select Media",
      multi: true,
      value: initialValues.media,
      initial: initialData?.media,
      onChange: (files, form) => {
        form.setValue("media", files);
      },
    },
  ];

  return (
    <SidebarModal
      key={initialData?.id ?? "new"}
      open={isShown}
      onClose={close}
      title={`${isEdit ? "Edit" : "Add"} Product`}
      list={fields}
      defaultValues={initialValues}
      schema={productSchema}
      submitLabel={isEdit ? "Update" : "Add"}
      loading={
        createProductMutation.isPending || updateProductMutation.isPending
      }
      onSubmit={onSubmit}
    >
      {(createProductMutation.isPending || updateProductMutation.isPending) && (
        <div className="flex items-center justify-center p-4">
          <FiLoader className="animate-spin text-2xl text-foreground-primary" />
        </div>
      )}
    </SidebarModal>
  );
}
