"use client";

import TableLayout from "@/components/admin/shared/table/TableLayout";
import { useSetParams } from "@/hooks/setParams";
import { useListQuery } from "@/hooks/queries";
import { useSidebarFormContext } from "@/store/sidebarFormContext";
import FiltersBar from "@/components/admin/shared/FiltersBar";
import { formatPhoneNumber } from "@/utils/formatPhone";

export default function CustomersContent({ searchParams }) {
  const { setInitialData, show } = useSidebarFormContext();
  const setParams = useSetParams();

  const { data: { customers = [], pagination = {} } = {}, isFetching } =
    useListQuery({
      handle: "customers",
      url: "/customers",
      params: searchParams,
      requiresAuth: true,
    });

  const headings = [
    {
      title: "Name",
      key: "name",
      type: "text",
    },
    {
      title: "Email",
      key: "email",
      type: "text",
      icon: "email",
    },
    {
      title: "Phone Number",
      key: "phone",
      type: "text",
      icon: "phone",
      render: (row) => formatPhoneNumber(row.phone),
    },
    {
      title: "Gender",
      key: "gender",
      type: "text",
      capitalize: true,
    },
    {
      title: "Date of Birth",
      key: "dateOfBirth",
      type: "date",
    },
    {
      title: "Total Bookings",
      key: "bookingsCount",
      type: "text",
      render: () => 0,
    },
    {
      title: "Action",
      key: "actions",
      type: "actions",
      actions: {
        edit: (row) => {
          setInitialData(row);
          show();
        },
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
  ];

  return (
    <>
      <FiltersBar filters={filters} searchParams={searchParams} />

      <TableLayout
        headings={headings}
        rows={customers}
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
