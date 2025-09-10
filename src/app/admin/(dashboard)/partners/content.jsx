"use client";

import TableLayout from "@/components/admin/shared/table/TableLayout";
import { useSetParams } from "@/hooks/setParams";
import { useDeleteMutation, useListQuery } from "@/hooks/queries";
import FiltersBar from "@/components/admin/shared/FiltersBar";

export default function PartnersContent({ searchParams }) {
  const setParams = useSetParams();

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
      title: "Status",
      key: "status",
      type: "status",
      options: [
        { value: "ACTIVE", label: "Active" },
        { value: "ARCHIVED", label: "Archived" },
      ],
    },
    {
      title: "Action",
      key: "actions",
      type: "actions",
      actions: {
        view: { href: `/admin/partners/` }, // id will be added
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
