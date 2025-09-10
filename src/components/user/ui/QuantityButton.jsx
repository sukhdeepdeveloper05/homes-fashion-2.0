"use client";

import { cn } from "@/lib/utils";
import { useCartContext } from "@/store/cartContext";
import { FiMinus, FiPlus } from "react-icons/fi";

export default function QuantityButton({ item, className }) {
  const { updateQuantity, updatingId } = useCartContext();

  const isUpdating = updatingId === item.id; // ✅ only disable this item

  const increment = () => {
    if (isUpdating) return;
    if (item.quantity < item.product.maxQuantityPerOrder) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };

  const decrement = () => {
    if (isUpdating) return;
    updateQuantity(item.id, item.quantity - 1);
  };

  return (
    <div
      className={cn(
        "flex items-center border rounded-md overflow-hidden w-fit h-8 bg-accent-primary/20 border-accent-primary/70",
        isUpdating &&
          "opacity-80 pointer-events-none animate-pulse animation-duration-[800ms]", // ✅ disable whole button
        className
      )}
    >
      <button
        onClick={decrement}
        className="text-accent-primary hover:not-disabled:bg-accent-primary/30 size-8 flex items-center justify-center"
      >
        <FiMinus />
      </button>
      <span className="px-2 py-1 text-accent-primary font-medium min-w-9 text-center cursor-default">
        {item.quantity}
      </span>
      <button
        onClick={increment}
        className="text-accent-primary hover:not-disabled:bg-accent-primary/30 size-8 flex items-center justify-center disabled:opacity-50"
        disabled={item.quantity >= item.product.maxQuantityPerOrder}
      >
        <FiPlus />
      </button>
    </div>
  );
}
