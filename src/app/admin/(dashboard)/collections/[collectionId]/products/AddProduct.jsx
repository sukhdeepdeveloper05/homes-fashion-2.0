"use client";

import Checkbox from "@/components/ui/fields/Checkbox";
import SidebarModal from "@/components/admin/ui/modals/SidebarModal";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FiLoader } from "react-icons/fi";
import {
  invalidateQueries,
  useInfiniteListQuery,
  useUpdateMutation,
} from "@/hooks/queries";
import { useSidebarFormContext } from "@/store/sidebarFormContext";
import z from "zod";
import { toast } from "sonner";
import { useController } from "react-hook-form";
import { MEDIA_URL } from "@/config/Consts";

export default function AddProductToCollectionModal({ collectionId }) {
  const { isShown, close } = useSidebarFormContext();

  const [search, setSearch] = useState("");

  const addProductsMutation = useUpdateMutation({
    handle: "collection",
    url: `/collections`,
  });

  const schema = z.object({
    products: z.array(z.string().nonempty()).min(1, {
      message: "Select at least one product",
    }),
  });

  async function handleSubmit(values, form) {
    try {
      await addProductsMutation.mutateAsync({
        id: collectionId,
        values: { products: values.products },
      });
      close();
      form.reset();
      invalidateQueries("products");
      invalidateQueries(collectionId);
    } catch (error) {}
  }

  function onInvalid(errors) {
    if (errors.products) {
      toast.error(errors.products.message);
    }
  }

  const fields = [
    {
      name: "search",
      label: "Search",
      type: "search",
      placeholder: "Search Products",
      size: "md",
      wrapperClass: "w-full",
      value: search,
      onKeyDown: (e) => e.key === "Enter" && e.preventDefault(),
      onSearch: setSearch,
    },
  ];

  const defaultValues = useMemo(
    () => ({
      products: [],
    }),
    []
  );

  return (
    <SidebarModal
      open={isShown}
      onClose={close}
      schema={schema}
      defaultValues={defaultValues}
      title={`Add Products`}
      list={fields}
      submitLabel={"Add"}
      loading={addProductsMutation.isPending}
      onSubmit={handleSubmit}
      onInvalid={onInvalid}
    >
      <ProductsList collectionId={collectionId} search={search} />
    </SidebarModal>
  );
}

function ProductsList({ collectionId, search }) {
  const {
    data: { products = [] } = {},
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteListQuery({
    handle: "products",
    url: `/products`,
    params: {
      collectionId,
      exclude: "collectionId",
      search,
    },
    queryKey: ["collectionProducts", "products", collectionId, search],
  });

  const {
    field: { value: productsIds = [], onChange },
  } = useController({
    name: "products",
  });

  return (
    <div className="flex-1 overflow-y-auto border-t border-gray-200">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <FiLoader className="animate-spin text-2xl text-foreground-primary" />
        </div>
      ) : (
        !products.length > 0 && (
          <div className="flex justify-center items-center h-full">
            <span className="text-gray-500">No products found</span>
          </div>
        )
      )}
      {!isLoading && products.length > 0 && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <label className="border-b border-gray-200 py-3 text-sm flex items-center justify-between px-4 select-none cursor-pointer">
                <div className="flex items-center gap-2">
                  <span
                    className={`flex-shrink-0 rounded-md overflow-hidden bg-foreground-secondary flex items-center justify-center uppercase text-xl font-bold text-white size-10`}
                  >
                    {product?.featuredImage ? (
                      <Image
                        src={`${MEDIA_URL}${product.featuredImage.src}`}
                        alt=""
                        width={100}
                        height={100}
                        className="size-full object-cover"
                      />
                    ) : (
                      product.title[0]
                    )}
                  </span>
                  <span className="line-clamp-1 text-ellipsis">
                    {product.title}
                  </span>
                </div>
                <Checkbox
                  key={product.id + "checkbox"}
                  name={product.id + "checkbox"}
                  className="flex"
                  checked={productsIds.includes(product.id)}
                  onChange={(checked) => {
                    onChange(
                      checked
                        ? [...productsIds, product.id]
                        : productsIds.filter((id) => id !== product.id)
                    );
                  }}
                />
              </label>
            </li>
          ))}
        </ul>
      )}

      {isFetchingNextPage ? (
        <div className="flex items-center justify-center p-4">
          <FiLoader className="animate-spin text-2xl text-foreground-primary" />
        </div>
      ) : (
        hasNextPage && (
          <div className="w-full text-center p-4">
            <button
              type="button"
              className="button button-small border border-gray-300 font-medium"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? "Loading..." : "Load more"}
            </button>
          </div>
        )
      )}
    </div>
  );
}
