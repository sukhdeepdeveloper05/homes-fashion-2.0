"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cartContext";

export default function AddToCartButton({
  item,
  className,
  addText = "Add",
  removeText = "Added",
  ...rest
}) {
  const { cart, addToCart, removeFromCart } = useCart();

  const inCart = cart.items.findIndex((i) => i.id === item.id) >= 0;

  return (
    <Button
      onClick={(e) => {
        e.stopPropagation();
        if (inCart) removeFromCart(item.id);
        else addToCart(item);
      }}
      size="small"
      className={cn("", className)}
      disabled={inCart}
      {...rest}
    >
      {inCart ? removeText : addText}
    </Button>
  );
}
