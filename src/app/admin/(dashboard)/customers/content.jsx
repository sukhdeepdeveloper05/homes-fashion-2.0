"use client";

import SearchField from "@/components/ui/fields/SearchField";
import TableLayout from "@/components/shared/table/TableLayout";
import { useSetParams } from "@/hooks/setParams";
import { useDeleteMutation, useListQuery } from "@/hooks/queries";
import { useSidebarFormContext } from "@/store/sidebarFormContext";
import { Filter } from "lucide-react";
import FiltersBar from "@/components/shared/FiltersBar";

export default function CustomersContent({ searchParams }) {
  const { setInitialData, show } = useSidebarFormContext();
  const setParams = useSetParams();

  const { data: { customers = [], pagination = {} } = {}, isFetching } =
    useListQuery("customers", "/customers", searchParams, true);

  // const { mutateAsync: handleDelete, isPending: deleteLoading } =
  //   useDeleteMutation("customer");

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
