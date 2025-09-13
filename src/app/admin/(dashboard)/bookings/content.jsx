"use client";

import TableLayout from "@/components/admin/shared/table/TableLayout";
import { BOOKING_STATUSES } from "@/config/Consts";
import { useSetParams } from "@/hooks/setParams";
import { useListQuery, useUpdateMutation } from "@/hooks/queries";
import FiltersBar from "@/components/admin/shared/FiltersBar";
import { useSidebarFormContext } from "@/store/sidebarFormContext";

export default function BookingsContent({ searchParams }) {
  const { setInitialData, show } = useSidebarFormContext();

  const setParams = useSetParams();

  const { data: { bookings = [], pagination = {} } = {}, isFetching } =
    useListQuery({
      handle: "bookings",
      url: "/bookings",
      queryKey: ["bookings", searchParams],
      params: searchParams,
      requiresAuth: true,
    });

  const updateBookingMutation = useUpdateMutation({
    handle: "booking",
    url: `/bookings`,
    invalidate: false,
  });

  console.log(bookings[0]);

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
      render: (row) => row.orderItem.product?.title,
    },
    {
      title: "Quantity",
      key: "quantity",
      type: "text",
      render: (row) => row.orderItem.quantity,
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
      sortable: true,
    },
    {
      title: "Scheduled at",
      key: "scheduledAt",
      type: "date",
      showTime: true,
      sortable: true,
    },
    {
      title: "Customer",
      key: "customer",
      type: "text",
      render: (row) => row.customer.name,
    },
    {
      title: "Partner",
      key: "partner",
      type: "text",
      render: (row) => row.partner || "--",
    },
    {
      title: "Booking Status",
      key: "status",
      type: "status",
      options: BOOKING_STATUSES,
      hideOptions: false,
      onChange: async (bookingId, value) => {
        await updateBookingMutation.mutateAsync({
          id: bookingId,
          values: { status: value },
        });
      },
    },
    {
      title: "Action",
      key: "actions",
      type: "actions",
      actions: {
        view: { href: `/admin/bookings/` }, // id will be added
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
        sortBy={searchParams.sortBy}
        sortDir={searchParams.sortDir}
        onSort={(k, d) => setParams({ page: 1, sortBy: k, sortDir: d })}
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
