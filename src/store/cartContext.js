"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const CART_KEY = "cart";

function calculateTotals(items) {
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
  return { totalPrice, totalQuantity };
}

const CartContext = createContext({
  cart: {
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
  },
  addToCart: () => {},
  removeFromCart: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }) {
  const [cart, setCart] = useState({
    items: [],
    totalPrice: 0,
    totalQuantity: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) setCart(JSON.parse(stored));
    } catch {}
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const syncCart = (e) => {
      if (e.key === CART_KEY && e.newValue) {
        setCart(JSON.parse(e.newValue));
      }
    };
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((product) => {
    setCart((prev) => {
      const existing = prev.items.find((item) => item.id === product.id);
      let updatedItems;
      if (existing) {
        updatedItems = prev.items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        updatedItems = [
          ...prev.items,
          { ...product, quantity: 1, totalPrice: product.price },
        ];
      }
      return { items: updatedItems, ...calculateTotals(updatedItems) };
    });
  }, []);

  const removeFromCart = useCallback((id) => {
    setCart((prev) => {
      const updatedItems = prev.items.filter((item) => item.id !== id);
      return { items: updatedItems, ...calculateTotals(updatedItems) };
    });
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    setCart((prev) => {
      const updatedItems = prev.items
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: Math.max(0, quantity),
                totalPrice: item.price * quantity,
              }
            : item
        )
        .filter((item) => item.quantity > 0);
      return { items: updatedItems, ...calculateTotals(updatedItems) };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({ items: [], totalPrice: 0, totalQuantity: 0 });
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
