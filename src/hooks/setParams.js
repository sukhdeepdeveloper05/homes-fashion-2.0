"use client";

import { useRouter } from "next/navigation";

const order = [
  "search",
  "status",
  "orderStatus",
  "paymentStatus",
  "bookingStatus",
  "available",
  "collectionId",
  "sortKey",
  "sortDir",
  "page",
  "perPage",
];

export function buildOrderedQueryString(params, order = []) {
  const parts = [];

  order.forEach((key) => {
    if (key in params && params[key] !== undefined && params[key] !== null) {
      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      );
    }
  });

  Object.keys(params).forEach((key) => {
    if (
      !order.includes(key) &&
      params[key] !== undefined &&
      params[key] !== null
    ) {
      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      );
    }
  });

  return parts.join("&");
}

export function useSetParams() {
  const router = useRouter();

  return (newParams) => {
    const searchParams = new URLSearchParams(window.location.search);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === "" || value === null) {
        searchParams.delete(key);
      } else {
        searchParams.set(key, value);
      }
    });

    const paramsObject = {};
    searchParams.forEach((val, k) => {
      paramsObject[k] = val;
    });

    router.replace(`?${buildOrderedQueryString(paramsObject, order)}`, {
      scroll: false,
    });
  };
}
