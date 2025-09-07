import { useDeleteMutation, useUpdateMutation } from "@/hooks/queries";
import { useSidebarFormContext } from "@/store/sidebarFormContext";
import { PRODUCT_AVAILABILITIES, PRODUCT_STATUSES } from "@/config/Consts";

export default function useProductsTableColumns() {
  const { setInitialData, show } = useSidebarFormContext();

  const { mutateAsync: updateProduct } = useUpdateMutation({
    handle: "product",
    url: "/products",
  });
  const { mutateAsync: handleDelete, isPending: deleteLoading } =
    useDeleteMutation({
      handle: "product",
      url: "/products",
    });

  return [
    {
      title: "Title",
      key: "title",
      type: "text",
      truncate: true,
      sortable: true,
    },
    {
      title: "Tags",
      key: "tags",
      type: "text",
      render: ({ tags }) => (tags.length > 0 ? tags.join(", ") : "N/A"),
      columnClass: "w-48",
    },
    {
      title: "Price",
      key: "price",
      type: "text",
      render: ({ price }) => "₹" + price,
      sortable: true,
      columnClass: "w-48",
    },
    {
      title: "Collections",
      key: "collections",
      type: "text",
      render: ({ collections }) =>
        collections.length > 0
          ? collections.map((c) => c.title).join(", ")
          : "N/A",
    },
    {
      title: "Availability",
      key: "available",
      name: "available",
      type: "status",
      columnClass: "w-48",
      options: PRODUCT_AVAILABILITIES,
      onChange: async (productId, value) => {
        try {
          await updateProduct({ id: productId, values: { available: value } });
        } catch (error) {
          console.log(error.message);
        }
      },
    },
    {
      title: "Status",
      key: "status",
      type: "status",
      columnClass: "w-48",
      options: PRODUCT_STATUSES,
      onChange: async (productId, value) => {
        try {
          await updateProduct({ id: productId, values: { status: value } });
        } catch (error) {
          console.log(error.message);
        }
      },
    },
    {
      title: "Updated At",
      key: "updatedAt",
      type: "date",
      sortable: true,
      columnClass: "w-48",
    },
    {
      title: "Action",
      key: "actions",
      type: "actions",
      columnClass: "w-48",
      actions: {
        edit: (row) => {
          setInitialData(row);
          show();
        },
        delete: {
          onDelete: async (id) => await handleDelete(id),
          isLoading: deleteLoading,
          showDialog: true,
          title: "Delete Product",
        },
      },
    },
  ];
}
