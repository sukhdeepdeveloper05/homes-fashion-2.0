"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  useCartQuery,
  useAddCartItem,
  useUpdateCartItem,
  useDeleteCartItem,
} from "@/hooks/cartQueries";
import { invalidateQueries } from "@/hooks/queries";

const CART_KEY = "cart";

const CartContext = createContext({
  cart: { items: [], totalPrice: 0 },
  isLoaded: false,
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  isAdding: false,
  isUpdating: false,
  isDeleting: false,
  isLoggedIn: false,
});

const recalcCart = (items) => ({
  items,
  totalPrice: items.reduce((sum, i) => sum + i.totalPrice, 0),
});

export function CartProvider({ children, user }) {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  // React Query hooks
  const { data: serverCart, isFetching } = useCartQuery(user);
  const { mutateAsync: addItemMutation, isPending: isAdding } =
    useAddCartItem(user);
  const deleteItemMutation = useDeleteCartItem(user);

  // ✅ Attach onSuccess directly here
  const updateItemMutation = useUpdateCartItem(user, {
    onSuccess: (updatedItem, { id }) => {
      updateItem(updatedItem, id);
    },
  });

  // 🔥 Update or replace an item in cart
  const updateItem = (newItem, id) => {
    if (!newItem) {
      setCart((prev) => {
        const updatedItems = prev.items.filter((i) => i.id !== id);
        return recalcCart(updatedItems);
      });
      return;
    }
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

  const mergeGuestCart = useCallback(
    async (cart) => {
      try {
        if (cart) {
          const guestCart = JSON.parse(cart);
          if (guestCart.items?.length > 0) {
            const cartItems = guestCart.items.map((i) => ({
              product: i.product.id,
              quantity: i.quantity,
            }));
            await addItemMutation({
              cartItems,
            });

            setCart({
              items: [],
              totalPrice: 0,
            });

            invalidateQueries("cart");

            localStorage.removeItem(CART_KEY);
          }
        }
      } catch (err) {
        console.error("Failed to merge guest cart", err);
      }
    },
    [addItemMutation]
  );

  useEffect(() => {
    (async () => {
      const stored = localStorage.getItem(CART_KEY);
      if (user && user.role === "customer") {
        if (stored) {
          localStorage.removeItem(CART_KEY);
          setCart({ items: [], totalPrice: 0 });
          await mergeGuestCart(stored);
        }

        if (!isFetching && serverCart) {
          setCart(serverCart);
          setIsLoaded(true);
        }
      } else {
        try {
          if (stored) setCart(JSON.parse(stored));
        } catch {}
        setIsLoaded(true);
      }
    })();
  }, [user, serverCart, isFetching, mergeGuestCart]);

  // Sync cart to localStorage only for guests
  useEffect(() => {
    if (isLoaded && !user) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded, user]);

  // Cart functions
  const addToCart = async (product) => {
    if (user) {
      const data = await addItemMutation({
        product: product.id,
        quantity: 1,
      });
      updateItem(data);
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
    if (user) {
      // ✅ No need to manually update state — server response updates it
      await updateItemMutation.mutateAsync({ id, quantity });
    } else {
      const item = cart.items.find((i) => i.id === id);
      if (item) {
        updateItem({
          ...item,
          quantity,
          totalPrice: (item?.pricePerItem || item?.product?.price) * quantity,
        });
      }
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
        isLoaded: isLoaded && !isFetching,
        isAdding: isAdding,
        isUpdating: updateItemMutation.isPending,
        isDeleting: deleteItemMutation.isPending,
        isLoggedIn: !!user,
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
