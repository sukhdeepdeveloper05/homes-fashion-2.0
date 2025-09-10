"use client";

import { createContext, useContext, useState, useEffect } from "react";
import {
  useCartQuery,
  useAddCartItem,
  useUpdateCartItem,
  useDeleteCartItem,
} from "@/hooks/cartQueries";

const CART_KEY = "cart";

const CartContext = createContext();

const recalcCart = (items) => ({
  items,
  totalPrice: items.reduce((sum, i) => sum + i.totalPrice, 0),
});

export function CartProvider({ children, user }) {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  // React Query hooks
  const { data: serverCart, isLoading } = useCartQuery(user);
  const addItemMutation = useAddCartItem();
  const deleteItemMutation = useDeleteCartItem();

  // ✅ Attach onSuccess directly here
  const updateItemMutation = useUpdateCartItem({
    onMutate: async ({ id }) => {
      setUpdatingId(id);
    },
    onSuccess: (updatedItem) => {
      updateItem(updatedItem);
    },
    onSettled: () => {
      setUpdatingId(null);
    },
  });

  // 🔥 Update or replace an item in cart
  const updateItem = (newItem) => {
    setCart((prev) => {
      const exists = prev.items.find((i) => i.id === newItem.id);
      let updatedItems;

      if (exists) {
        if (newItem.quantity <= 0) {
          updatedItems = prev.items.filter((i) => i.id !== newItem.id);
        } else {
          updatedItems = prev.items.map((i) =>
            i.id === newItem.id ? { ...i, ...newItem } : i
          );
        }
      } else {
        updatedItems = [...prev.items, newItem];
      }

      return recalcCart(updatedItems);
    });
  };

  // Load cart when user changes
  useEffect(() => {
    if (user) {
      const mergeGuestCart = async () => {
        try {
          const stored = localStorage.getItem(CART_KEY);
          if (stored) {
            const guestCart = JSON.parse(stored);
            if (guestCart.items?.length) {
              for (const item of guestCart.items) {
                await addItemMutation.mutateAsync({
                  product: item.product.id,
                  quantity: item.quantity,
                });
              }
              localStorage.removeItem(CART_KEY);
            }
          }
        } catch (err) {
          console.error("Failed to merge guest cart", err);
        }
      };

      if (!isLoading && serverCart) {
        setCart(serverCart);
        setIsLoaded(true);
        // mergeGuestCart();
      }
    } else {
      try {
        const stored = localStorage.getItem(CART_KEY);
        if (stored) setCart(JSON.parse(stored));
      } catch {}
      setIsLoaded(true);
    }
  }, [user, serverCart, isLoading]);

  // Sync cart to localStorage only for guests
  useEffect(() => {
    if (isLoaded && !user) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded, user]);

  // Cart functions
  const addToCart = async (product) => {
    if (user) {
      const data = await addItemMutation.mutateAsync({
        product: product.id,
        quantity: 1,
      });
      updateItem(data); // ✅ always trust server response
    } else {
      const existing = cart.items.find((item) => item.id === product.id);
      if (!existing) {
        updateItem({
          id: product.id,
          product,
          quantity: 1,
          pricePerItem: product.price,
          totalPrice: product.price,
        });
      }
    }
  };

  const removeFromCart = async (id) => {
    if (user) {
      await deleteItemMutation.mutateAsync(id);
    }
    setCart((prev) => recalcCart(prev.items.filter((item) => item.id !== id)));
  };

  const updateQuantity = async (id, quantity) => {
    setUpdatingId(id);
    try {
      if (user) {
        // ✅ No need to manually update state — server response updates it
        await updateItemMutation.mutateAsync({ id, quantity });
      } else {
        const item = cart.items.find((i) => i.id === id);
        if (item) {
          updateItem({
            ...item,
            quantity,
            totalPrice: item.pricePerItem * quantity,
          });
        }
      }
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemMutation,
        isLoaded: isLoaded && !isLoading,
        isAdding: addItemMutation.isPending,
        updatingId,
        isDeleting: deleteItemMutation.isPending,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx)
    throw new Error("useCartContext must be used inside <CartProvider>");
  return ctx;
}
