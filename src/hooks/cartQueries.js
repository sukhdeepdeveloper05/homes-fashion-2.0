// cartQueries.js
"use client";

import { createData, deleteData, getData, updateData } from "@/lib/api";
import axios from "@/services/Axios";
import {
  useQuery,
  useMutation,
  useQueryClient,
  mutationOptions,
} from "@tanstack/react-query";

// Fetch user's cart
export function useCartQuery(user) {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await getData("/cart", null, true);
      return data;
    },
    enabled: !!user,
  });
}

// Add item to cart
export function useAddCartItem() {
  return useMutation({
    mutationFn: async ({ product, quantity }) => {
      const { data } = await createData(
        "/cart",
        { product, quantity },
        null,
        true
      );
      return data;
    },
  });
}

// Update cart item quantity (and optional fields like address or bookingTime)
export function useUpdateCartItem({ ...mutationOptions }) {
  return useMutation({
    mutationFn: async ({ id, quantity, address, bookingTime }) => {
      const { data } = await updateData(
        `/cart/${id}`,
        null,
        {
          quantity,
          address,
          bookingTime,
        },
        true
      );
      return data;
    },
    ...mutationOptions,
  });
}

// Delete cart item
export function useDeleteCartItem() {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await deleteData(`/cart/${id}`, null, true);
      return data;
    },
  });
}
