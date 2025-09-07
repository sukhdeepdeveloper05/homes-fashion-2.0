"use client";

import PageHeader from "@/components/admin/shared/PageHeader";
import TableLayout from "@/components/admin/shared/table/TableLayout";
import { PRODUCT_AVAILABILITIES, PRODUCT_STATUSES } from "@/config/Consts";
import { use } from "react";
import AddProductToCollectionModal from "./AddProduct";
import { invalidate, useListQuery, useUpdateMutation } from "@/hooks/queries";
import { useSetParams } from "@/hooks/setParams";
import FiltersBar from "@/components/admin/shared/FiltersBar";

export default function ProductsTabPage({ params, searchParams }) {
  const { collectionId } = use(params);
  const {
    page: rawPage = 1,
    perPage: rawPerPage = 10,
    search = null,
  } = use(searchParams);

  const page = Number(rawPage);
  const perPage = Math.min(Number(rawPerPage), 50);

  const setParams = useSetParams();

  const { data: { products = [], pagination = {} } = {}, isFetching } =
    useListQuery({
      handle: "products",
      url: `/products`,
      params: {
        page,
        perPage,
        search,
        collectionId,
      },
      queryKey: [
        "collectionProducts",
        "products",
        collectionId,
        page,
        perPage,
        search,
      ],
    });

  const { mutateAsync: removeProduct, isPending: deleteLoading } =
    useUpdateMutation({
      handle: "product",
      url: `/collections`,
    });

  const headings = [
    { title: "Title", key: "title", type: "text", truncate: true },
    {
      title: "Price",
      key: "price",
      type: "text",
      render: ({ price }) => "₹" + price,
    },
    {
      title: "Availability",
      key: "available",
      type: "status",
      options: PRODUCT_AVAILABILITIES,
      hideOptions: true,
    },
    {
      title: "Status",
      key: "status",
      type: "status",
      options: PRODUCT_STATUSES,
      hideOptions: true,
    },
    {
      title: "Action",
      key: "actions",
      type: "actions",
      actions: {
        delete: {
          onDelete: async (rowId) => {
            await removeProduct({
              id: collectionId,
              values: { products: [rowId], detach: true },
            });
            if (
              (pagination.total - 1) % perPage === 0 &&
              pagination.total > perPage
            ) {
              setParams({ page: page - 1 });
            }
            invalidate("products");
            invalidate(collectionId);
          },
          isLoading: deleteLoading,
          isDialogShown: false,
        },
      },
    },
  ];

  const filters = [
    {
      type: "search",
      paramKey: "search",
      wrapperClass: "w-full",
      placeholder: "Search products",
      value: search ?? "",
    },
  ];

  return (
    <>
      <div id="products">
        <PageHeader
          title="Products"
          description="Manage your products in this collection"
          buttons={[{ identifier: "add", label: "Add Products" }]}
        />

        <FiltersBar filters={filters} />

        <TableLayout
          headings={headings}
          rows={products}
          loading={isFetching}
          pagination={{
            total: pagination.total,
            page,
            perPage,
            showPerPage: true,
          }}
          onPerPageChange={(v) => setParams({ page: 1, perPage: v })}
          skeletonRows={Math.min(perPage, 10)}
        />

        <AddProductToCollectionModal collectionId={collectionId} />
      </div>
    </>
  );
}
