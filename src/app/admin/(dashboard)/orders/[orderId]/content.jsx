"use client";

import PageHeader from "@/components/admin/shared/PageHeader";
import TableLayout from "@/components/admin/shared/table/TableLayout";
import { useDetailsQuery } from "@/hooks/queries";
import { useSidebarFormContext } from "@/store/sidebarFormContext";

export default function OrderDetailsContent({ orderId }) {
  const { setInitialData, show } = useSidebarFormContext();

  const { data: { details = {} } = {}, isFetching } = useDetailsQuery({
    handle: "order",
    queryKey: ["orderDetails", orderId],
    url: `/orders`,
    params: { id: orderId },
    requiresAdmin: true,
  });

  console.log(details);

  const headings = [
    {
      title: "Item Id",
      key: "id",
      type: "text",
      truncate: true,
      render: (row) => "#" + row.id,
    },
    {
      title: "Product Title",
      key: "product",
      type: "text",
      truncate: true,
      render: (row) => row.product?.title,
    },
    {
      title: "Quantity",
      key: "quantity",
      type: "text",
    },
    {
      title: "Total Price",
      key: "totalPrice",
      type: "text",
      render: (row) => "₹" + row.totalPrice,
    },
    {
      title: "Action",
      key: "actions",
      type: "actions",
      actions: {
        // view: (rowId) => router.push(`/admin/orders/${rowId}`),
        edit: (row) => {
          setInitialData(row);
          show();
        },
        // delete: {
        //   onDelete: async (id) =>
        //     await something(id),
        //   isLoading: false,
        //   showDialog: true,
        // },
      },
    },
  ];

  return (
    <>
      <div className="w-full rounded-xl bg-white px-4 py-5 md:px-6">
        <PageHeader
          title="Order items"
          description="Manage your order items in this order"
        />

        <TableLayout
          headings={headings}
          rows={details?.items}
          loading={isFetching}
        />
      </div>
    </>
  );
}
