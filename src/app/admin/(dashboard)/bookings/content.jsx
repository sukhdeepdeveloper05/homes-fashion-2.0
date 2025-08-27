"use client";

import SearchField from "@/components/ui/fields/SearchField";
import TableLayout from "@/components/shared/table/TableLayout";
import SelectField from "@/components/ui/fields/SelectField";
import { BOOKING_STATUSES } from "@/config/Consts";
import { useSetParams } from "@/hooks/setParams";
import { useListQuery } from "@/hooks/queries";
import FiltersBar from "@/components/shared/FiltersBar";

export default function BookingsContent({ searchParams }) {
  const setParams = useSetParams();

  const {
    page: rawPage = 1,
    perPage: rawPerPage = 10,
    search = "",
    sortKey = null,
    sortDir = null,
    bookingStatus = null,
  } = searchParams || {};

  const page = Number(rawPage);
  const perPage = Math.min(Number(rawPerPage), 50);

  const { data: { bookings = [], pagination = {} } = {}, isFetching } =
    useListQuery("bookings", "/bookings", searchParams, true);

  const headings = [
    {
      title: "Booking Id",
      key: "id",
      type: "text",
      truncate: true,
      render: (row) => "#" + row.id,
    },
    {
      title: "Product Title",
      key: "productTitle",
      type: "text",
      render: (row) => row?.product?.title,
    },
    {
      title: "Quantity",
      key: "quantity",
      type: "text",
      render: (row) => row.quantity,
    },
    {
      title: "Total Price",
      key: "totalPrice",
      type: "text",
      render: (row) => "₹" + row.orderItem.totalPrice,
    },
    {
      title: "Booked at",
      key: "bookedAt",
      type: "date",
      showTime: true,
    },
    {
      title: "Scheduled at",
      key: "scheduledAt",
      type: "date",
      showTime: true,
    },
    {
      title: "Customer",
      key: "customer",
      type: "text",
      render: (row) => row.customer.name,
    },
    {
      title: "Booking Status",
      key: "bookingStatus",
      type: "status",
      options: BOOKING_STATUSES,
      hideOptions: true,
    },
    {
      title: "Action",
      key: "actions",
      type: "actions",
      actions: {
        view: { href: `/admin/bookings/` }, // id will be added
        // edit: (row) => setSelected(row),
        // delete: {
        //   onDelete: async (id) =>
        //     await something(id),
        //   isLoading: false,
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
      placeholder: "Search collections",
      value: searchParams.search ?? "",
    },
    {
      type: "select",
      paramKey: "bookingStatus",
      options: [{ value: null, label: "All Bookings" }, ...BOOKING_STATUSES],
      className: "md:max-w-80",
    },
  ];

  return (
    <>
      <FiltersBar filters={filters} searchParams={searchParams} />

      <TableLayout
        headings={headings}
        rows={bookings}
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
