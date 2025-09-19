// cartQueries.js
"use client";

import { createData, deleteData, getData, updateData } from "@/lib/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
export function useAddCartItem(user) {
  return useMutation({
    mutationFn: async (values) => {
      if (!user || user.role !== "customer") {
        toast.error("Only customers/guests can add items to the cart.");
        return;
      }

      const { data } = await createData({
        url: "/cart",
        data: values,
        requiresAuth: true,
      });
      return data;
    },
  });
}

// Update cart item quantity (and optional fields like address or bookingTime)
export function useUpdateCartItem(user,{ ...mutationOptions }) {
  return useMutation({
    mutationFn: async ({ id, quantity, address, bookingTime }) => {
      if (!user || user.role !== "customer") {
        toast.error("Only customers/guests can update cart items.");
        return;
      }
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
export function useDeleteCartItem(user) {
  return useMutation({
    mutationFn: async (id) => {
      if (!user || user.role !== "customer") {
        toast.error("Only customers/guests can delete cart items.");
        return;
      }

      const { data } = await deleteData({
        url: `/cart/${id}`,
        requiresAuth: true,
      });
      return data;
    },
  });
}
