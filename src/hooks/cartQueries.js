// cartQueries.js
"use client";

import { createData, deleteData, getData, updateData } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";

// Fetch user's cart
export function useCartQuery(user) {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await getData({ url: "/cart", requiresAuth: true });
      return data;
    },
    enabled: !!user && user.role === "customer",
  });
}

// Add item to cart
export function useAddCartItem() {
  return useMutation({
    mutationFn: async (values) => {
      const { data } = await createData({
        url: "/cart",
        data:values,
        requiresAuth: true,
      });
      return data;
    },
  });
}

// Update cart item quantity (and optional fields like address or bookingTime)
export function useUpdateCartItem({ ...mutationOptions }) {
  return useMutation({
    mutationFn: async ({ id, quantity, address, bookingTime }) => {
      const { data } = await updateData({
        url: `/cart/${id}`,
        data: {
          quantity,
          address,
          bookingTime,
        },
      });
      return data;
    },
    ...mutationOptions,
  });
}

// Delete cart item
export function useDeleteCartItem() {
  return useMutation({
    mutationFn: async (id) => {
      const { data } = await deleteData({
        url: `/cart/${id}`,
        requiresAuth: true,
      });
      return data;
    },
  });
}
