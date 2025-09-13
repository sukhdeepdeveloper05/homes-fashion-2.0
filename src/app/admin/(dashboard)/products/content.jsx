"use client";

import TableLayout from "@/components/admin/shared/table/TableLayout";
import { useSetParams } from "@/hooks/setParams";
import { useListQuery } from "@/hooks/queries";
import useProductsTableColumns from "./columns";
import FiltersBar from "@/components/admin/shared/FiltersBar";
import useGetFilters from "./filters";

export default function ProductsContent({ searchParams }) {
  const setParams = useSetParams();

  const { data: { products = [], pagination = {} } = {}, isLoading } =
    useListQuery({
      handle: "products",
      url: "/products",
      queryKey: ["products", searchParams],
      params: searchParams,
    });

  const headings = useProductsTableColumns();

  const filters = useGetFilters({ searchParams });

  return (
    <>
      <FiltersBar filters={filters} searchParams={searchParams} />

      <TableLayout
        headings={headings}
        rows={products}
        loading={isLoading}
        sortBy={searchParams.sortBy}
        sortDir={searchParams.sortDir}
        onSort={(k, d) => setParams({ page: 1, sortBy: k, sortDir: d })}
        pagination={{
          total: pagination.total,
          page: searchParams.page,
          perPage: searchParams.perPage,
          showPerPage: true,
        }}
        onPageChange={(v) => setParams({ page: v })}
        onPerPageChange={(v) => setParams({ page: 1, perPage: v })}
        skeletonRows={Math.min(searchParams.perPage, 10)}
      />
    </>
  );
}
