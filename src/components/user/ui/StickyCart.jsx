"use client";

import Button from "@/components/ui/Button";
import { useCartContext } from "@/store/cartContext";
import { formatPrice } from "@/utils/formatPrice";
import Link from "next/link";

export default function StickyCart() {
  const { cart } = useCartContext();

  if (cart.items.length <= 0) {
    return;
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-10 flex items-center justify-between bg-white px-4 py-3 border-t border-gray-200">
      <p className="font-semibold">{formatPrice(cart.totalPrice)}</p>
      <Link href="/cart" className="button button-small button-primary__solid">
        View Cart
      </Link>
    </div>
  );
}
