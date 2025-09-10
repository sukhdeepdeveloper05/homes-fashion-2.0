"use client";

import { DetailsSkeleton } from "@/components/ui/Skeletons";
import { useDetailsQuery, useUpdateMutation } from "@/hooks/queries";
import MultiSelectField from "@/components/ui/fields/MultiSelectField";
import SelectField from "@/components/ui/fields/SelectField";
import TextArea from "@/components/ui/fields/TextArea";
import Input from "@/components/ui/fields/Input";
import Button from "@/components/ui/Button";
import { use, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { Form } from "@/components/shadcn/form";

export default function GeneralTabPage({ params }) {
  const { collectionId } = use(params);

  const updateCollectionMutation = useUpdateMutation({
    handle: "collection",
    url: "/collections",
  });

  const { data: { details = {} } = {}, isLoading } = useDetailsQuery({
    handle: "collection",
    queryKey: ["collectionDetails", collectionId],
    url: `/collections`,
    params: { id: collectionId },
    requiresAuth: false,
  });

  const form = useForm({
    resolver: zodResolver(
      z.object({
        title: z.string().nonempty({ error: "Collection Title is required" }),
        description: z.string().nonempty({ error: "Description is required" }),
      })
    ),
    defaultValues: {
      title: details.title || "",
      description: details.description || "",
    },
  });

  useEffect(() => {
    if (!isLoading && details) {
      form.reset({
        title: details.title || "",
        description: details.description || "",
        tags: details.tags || "",
        featuredImage: details.featuredImage || "",
      });
    }
  }, [isLoading]);

  async function onSubmit(values) {
    try {
      await updateCollectionMutation.mutateAsync({
        id: collectionId,
        values,
      });
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
    // { name: "tags", label: "Tags", type: "text", placeholder: "Tags" },
  ];

  const shapeItem = (item, idx) => {
    switch (item.type) {
      case "select":
        return item.multiple ? (
          <MultiSelectField key={idx} {...item} form={form} />
        ) : (
          <SelectField
            key={idx}
            {...item}
            value={value}
            form={form}
            onChange={(val) => form.setValue(item.name, val)}
          />
        );

      case "textarea":
        return (
          <TextArea
            key={idx}
            {...item}
            form={form}
            required={item.required}
            className="min-h-72"
          />
        );

      default:
        return (
          <Input key={idx} {...item} form={form} required={item.required} />
        );
    }
  };
  return (
    <>
      {isLoading && <DetailsSkeleton />}
      {!isLoading && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {fields.map(shapeItem)}
            <div className="text-right">
              <Button
                variant="primary"
                type="submit"
                isLoading={updateCollectionMutation.isPending}
                className="min-w-28"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
