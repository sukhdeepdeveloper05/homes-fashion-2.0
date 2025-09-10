"use client";

import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useCartContext } from "@/store/cartContext";
import { useRef } from "react";

export default function AddToCartButton({
  item,
  className,
  addText = "Add",
  removeText = "Added",
  ...rest
}) {
  const addId = useRef(null);
  const { cart, isLoaded, addToCart, removeFromCart, isAdding } =
    useCartContext();

  const inCart = cart.items.findIndex((i) => i.product.id === item.id) >= 0;

  return (
    <Button
      onClick={async (e) => {
        e.stopPropagation();
        addId.current = item.id;
        if (inCart) return;
        else await addToCart(item);
        addId.current = null;
      }}
      size="small"
      className={cn("", className)}
      isLoading={isAdding && addId.current === item.id}
      disabled={inCart || !isLoaded}
      {...rest}
    >
      {inCart ? removeText : addText}
    </Button>
  );
}
