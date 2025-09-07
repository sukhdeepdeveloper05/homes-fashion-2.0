"use client";

import { useSetParams } from "@/hooks/setParams";
import TableLayout from "@/components/admin/shared/table/TableLayout";
import { useListQuery } from "@/hooks/queries";
import useCollectionColumns from "./columns";
import FiltersBar from "@/components/admin/shared/FiltersBar";

export default function CollectionsContent({ searchParams }) {
  const setParams = useSetParams();

  const { data: { collections = [], pagination = {} } = {}, isFetching } =
    useListQuery({
      handle: "collections",
      url: "/collections",
      queryKey: ["collections", searchParams],
      params: searchParams,
    });

  const columns = useCollectionColumns();

  const filters = [
    {
      type: "search",
      paramKey: "search",
      wrapperClass: "w-full",
      placeholder: "Search collections",
      value: searchParams.search ?? "",
    },
  ];

  return (
    <>
      <FiltersBar filters={filters} searchParams={searchParams} />

      <TableLayout
        headings={columns}
        rows={collections}
        loading={isFetching}
        sortKey={searchParams.sortKey}
        sortDir={searchParams.sortDir}
        onSort={(k, d) => {
          setParams({ page: 1, sortKey: k, sortDir: d });
        }}
        pagination={{
          total: pagination.total,
          page: searchParams.page,
          perPage: searchParams.perPage,
          showPerPage: true,
        }}
        onPerPageChange={(v) => {
          setParams({ page: 1, perPage: v });
        }}
        skeletonRows={searchParams.perPage}
      />
    </>
  );
}
