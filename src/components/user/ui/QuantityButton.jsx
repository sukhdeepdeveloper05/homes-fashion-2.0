"use client";

import { cn } from "@/lib/utils";
import { useCartContext } from "@/store/cartContext";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useEffect, useState, useRef } from "react";

export default function QuantityButton({ item, className }) {
  const { updateQuantity } = useCartContext();
  const [localQty, setLocalQty] = useState(item.quantity);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef(null);

  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  const triggerUpdate = (newQty, immediate = false) => {
    if (newQty >= 1) {
      setLocalQty(newQty);
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    if (immediate) {
      // no debounce
      (async () => {
        setIsLoading(true);
        try {
          await updateQuantity(item.id, newQty);
        } finally {
          setIsLoading(false);
        }
      })();
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        await updateQuantity(item.id, newQty);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  };

  const increment = () => {
    if (isLoading) return;
    if (localQty < item.product.maxQuantityPerOrder) {
      triggerUpdate(localQty + 1);
    }
  };

  const decrement = () => {
    if (isLoading) return;
    if (localQty <= 1) {
      triggerUpdate(0, true);
      return;
    }
    triggerUpdate(localQty - 1);
  };

  return (
    <div
      className={cn(
        "flex items-center border rounded-md overflow-hidden w-fit h-8 bg-accent-primary/20 border-accent-primary/70",
        isLoading &&
          "opacity-80 pointer-events-none animate-pulse animation-duration-[800ms]",
        className
      )}
    >
      <button
        onClick={decrement}
        className="text-accent-primary hover:not-disabled:bg-accent-primary/30 size-8 flex items-center justify-center disabled:opacity-50"
        disabled={isLoading || localQty <= 0}
      >
        <FiMinus />
      </button>
      <span className="px-2 py-1 text-accent-primary font-medium min-w-9 text-center cursor-default">
        {localQty}
      </span>
      <button
        onClick={increment}
        className="text-accent-primary hover:not-disabled:bg-accent-primary/30 size-8 flex items-center justify-center disabled:opacity-50"
        disabled={isLoading || localQty >= item.product.maxQuantityPerOrder}
      >
        <FiPlus />
      </button>
    </div>
  );
}
