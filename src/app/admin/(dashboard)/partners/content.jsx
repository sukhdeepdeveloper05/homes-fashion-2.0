"use client";

import TableLayout from "@/components/admin/shared/table/TableLayout";
import { useSetParams } from "@/hooks/setParams";
import { useDeleteMutation, useListQuery } from "@/hooks/queries";
import FiltersBar from "@/components/admin/shared/FiltersBar";
import { formatPhoneNumber } from "@/utils/formatPhone";
import { useSidebarFormContext } from "@/store/sidebarFormContext";

export default function PartnersContent({ searchParams }) {
  const setParams = useSetParams();
  const { setInitialData, show } = useSidebarFormContext();

  const { data: { partners = [], pagination = {} } = {}, isFetching } =
    useListQuery({
      handle: "partners",
      url: "/partners",
      queryKey: ["partners", searchParams],
      params: searchParams,
      requiresAuth: true,
    });

  const { mutateAsync: handleDelete, isPending: deleteLoading } =
    useDeleteMutation({
      handle: "partner",
      url: "/partners",
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
      title: "Action",
      key: "actions",
      type: "actions",
      actions: {
        // view: { href: `/admin/partners/` },
        edit: (row) => {
          setInitialData(row);
          show();
        },
        delete: {
          onDelete: async (id) => await handleDelete(id),
          isFetching: deleteLoading,
          showDialog: true,
          title: "Delete Partner",
        },
      },
    },
  ];

  const filters = [
    {
      type: "search",
      paramKey: "search",
      wrapperClass: "w-full",
      placeholder: "Search partners",
      value: searchParams.search ?? "",
    },
  ];

  return (
    <>
      <FiltersBar filters={filters} searchParams={searchParams} />

      <TableLayout
        headings={headings}
        rows={partners}
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
