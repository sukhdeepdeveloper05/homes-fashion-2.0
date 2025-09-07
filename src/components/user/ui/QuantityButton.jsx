"use client";

import { cn } from "@/lib/utils";
import { useCart } from "@/store/cartContext";
import { FiMinus, FiPlus } from "react-icons/fi";

export default function QuantityButton({ item, maxValue, className }) {
  const { updateQuantity } = useCart();

  const increment = () => {
    if (item.quantity < maxValue) {
      updateQuantity(item.id, item.quantity + 1);
    }
  };
  const decrement = () => {
    updateQuantity(item.id, item.quantity - 1);
  };

  return (
    <div
      className={cn(
        "flex items-center border rounded-md overflow-hidden w-fit bg-accent-primary/20 border-accent-primary/70",
        className
      )}
    >
      <button
        onClick={decrement}
        className="px-2 py-1 text-accent-primary hover:not-disabled:bg-accent-primary/30 disabled:opacity-50 min-h-full"
      >
        <FiMinus />
      </button>
      <span className="px-2 py-1 text-accent-primary font-medium min-w-9 text-center cursor-default">
        {item.quantity}
      </span>
      <button
        onClick={increment}
        className="px-2 py-1 text-accent-primary hover:not-disabled:bg-accent-primary/30 disabled:opacity-50 min-h-full"
        disabled={item.quantity >= maxValue}
      >
        <FiPlus />
      </button>
    </div>
  );
}
