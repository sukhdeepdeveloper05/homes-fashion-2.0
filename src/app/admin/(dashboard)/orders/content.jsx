"use client";

import SearchField from "@/components/ui/fields/SearchField";
import TableLayout from "@/components/shared/table/TableLayout";
import SelectField from "@/components/ui/fields/SelectField";
import { ORDER_STATUSES, PYAMENT_STATUSES } from "@/config/Consts";
import { useSetParams } from "@/hooks/setParams";
import { useListQuery } from "@/hooks/queries";
import FiltersBar from "@/components/shared/FiltersBar";

export default function OrdersContent({ searchParams }) {
  const setParams = useSetParams();

  const { data: { orders = [], pagination = {} } = {}, isFetching } =
    useListQuery("orders", "/orders", searchParams, true);

  const headings = [
    {
      title: "Order Id",
      key: "id",
      type: "text",
      truncate: true,
      render: (row) => "#" + row.id,
    },
    {
      title: "Total Items",
      key: "totalItems",
      type: "text",
    },
    {
      title: "Total Price",
      key: "totalPrice",
      type: "text",
      render: (row) => "₹" + row.totalPrice,
    },
    {
      title: "Customer",
      key: "customer",
      type: "text",
      render: (row) => row.customer.name,
    },
    {
      title: "Order Status",
      key: "orderStatus",
      type: "status",
      options: ORDER_STATUSES,
      hideOptions: true,
    },
    {
      title: "Payment Status",
      key: "paymentStatus",
      type: "status",
      options: PYAMENT_STATUSES,
      hideOptions: true,
    },
    {
      title: "Action",
      key: "actions",
      type: "actions",
      actions: {
        view: { href: `/admin/orders/` }, // id will be added
        // edit: (row) => setInitialData(rows), // setInitialData from useSidebarFormContext
        // delete: {
        //   onDelete: async (id) =>
        //     await mutateAsync(id),
        //   isLoading: deleteLoading,
        //   showDialog: true,
        // },
      },
    },
  ];

  const filters = [
    {
      type: "search",
      paramKey: "search",
      wrapperClass: "w-full",
      placeholder: "Search customers",
      value: searchParams.search ?? "",
    },
    {
      type: "select",
      paramKey: "orderStatus",
      options: [{ value: null, label: "All Orders" }, ...ORDER_STATUSES],
      className: "md:max-w-80",
    },
    {
      type: "select",
      paramKey: "paymentStatus",
      options: [{ value: null, label: "All" }, ...PYAMENT_STATUSES],
      className: "md:max-w-80",
    },
  ];

  return (
    <>
      <FiltersBar filters={filters} searchParams={searchParams} />

      <TableLayout
        headings={headings}
        rows={orders}
        loading={isFetching}
        sortKey={searchParams.sortKey}
        sortDir={searchParams.sortDir}
        onSort={(k, d) => setParams({ page: 1, sortKey: k, sortDir: d })}
        pagination={{
          total: pagination.total,
          page: searchParams.page,
          perPage: searchParams.perPage,
          showPerPage: true,
        }}
        onPerPageChange={(v) => setParams({ page: 1, perPage: v })}
        skeletonRows={10}
      />
    </>
  );
}
