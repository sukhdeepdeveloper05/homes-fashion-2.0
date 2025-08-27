"use client";

import { PRODUCT_AVAILABILITIES, PRODUCT_STATUSES } from "@/config/Consts";
import { useListQuery } from "@/hooks/queries";

export default function useGetFilters({ searchParams }) {
  const { data: { collections = [] } = {} } = useListQuery(
    "collections",
    "/collections"
  );

  return [
    {
      type: "search",
      paramKey: "search",
      wrapperClass: "w-full",
      placeholder: "Search products",
      value: searchParams.search ?? "",
    },
    {
      type: "select",
      paramKey: "status",
      options: [{ value: null, label: "All Status" }, ...PRODUCT_STATUSES],
      className: "md:max-w-80",
    },
    {
      type: "select",
      paramKey: "available",
      options: [
        { value: null, label: "Availability" },
        ...PRODUCT_AVAILABILITIES,
      ],
      className: "md:max-w-80",
    },
    {
      type: "select",
      paramKey: "collectionId",
      options: [
        { value: null, label: "All Collections" },
        ...collections.map((c) => ({ value: c?.id, label: c?.title })),
      ],
      className: "md:max-w-80",
    },
  ];
}
