import { useDeleteMutation } from "@/hooks/queries";

export default function useCollectionColumns() {
  const deleteCollectionMutation = useDeleteMutation("collection");

  return [
    { title: "Title", key: "title", type: "text" },
    {
      title: "Tags",
      key: "tags",
      type: "text",
      render: ({ tags }) => (tags ? tags.join(", ") : "N/A"),
    },
    { title: "Products Count", key: "productsCount", type: "text" },
    { title: "Created At", key: "createdAt", type: "date" },
    { title: "Updated At", key: "updatedAt", type: "date" },
    {
      title: "Action",
      key: "actions",
      type: "actions",
      actions: {
        view: { href: `/admin/collections/` }, // id will be added
        delete: {
          onDelete: async (id) =>
            await deleteCollectionMutation.mutateAsync(id),
          isLoading: deleteCollectionMutation.isPending,
          showDialog: true,
          title: "Delete Collection",
        },
      },
    },
  ];
}
