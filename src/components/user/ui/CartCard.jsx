"use client";

import { Card, CardContent } from "@/components/shadcn/card";
import { cn } from "@/lib/utils";
import { useCartContext } from "@/store/cartContext";
import { formatPrice } from "@/utils/formatPrice";
import QuantityButton from "./QuantityButton";
import { Separator } from "@/components/shadcn/separator";
import Link from "next/link";
import CartIcon from "@/assets/icons/Cart";
import { SkeletonBox } from "@/components/ui/Skeletons";

export default function CartCard({
  icon,
  emptyMessage = "No items in your cart",
  className = "",
  emptyClassName = "",
  iconClassName = "w-1/4",
}) {
  const { cart, isLoaded } = useCartContext();

  if (!isLoaded)
    return (
      <Card className="p-0 shadow-none">
        <CardContent className={cn("p-0", className)}>
          <SkeletonBox className="h-36" />
        </CardContent>
      </Card>
    );

  if (isLoaded && !cart.items.length)
    return (
      <Card className="p-0">
        <CardContent
          className={cn(
            "p-0 min-h-36 flex flex-col items-center justify-center",
            className
          )}
        >
          <div className={cn("w-1/4", iconClassName)}>
            <CartIcon />
          </div>
          <p
            className={cn(
              "text-sm text-foreground-secondary/80",
              emptyClassName
            )}
          >
            {emptyMessage}
          </p>
        </CardContent>
      </Card>
    );

  return (
    <Card className="p-6">
      <CardContent className={cn("p-0", className)}>
        {cart.items.length > 0 && (
          <div>
            <h2 className="text-foreground-primary font-semibold text-xl">
              Cart
            </h2>
            <div className="flex flex-col gap-4 pb-6 mt-2">
              {cart.items.map((item) => (
                <CartCardItem key={item.product.id} item={item} />
              ))}
            </div>
            <Separator />
            <div className="pt-6">
              <Link
                href="/cart"
                className="button button-primary__solid w-full flex justify-between py-3 px-4 text-sm"
              >
                <span>
                  <span>{formatPrice(cart.totalPrice)} </span>
                </span>
                <span>View Cart</span>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CartCardItem({ item }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-foreground-primary text-sm line-clamp-2">
        {item.product.title}
      </span>
      <div className="flex items-center gap-4">
        <QuantityButton item={item} />
        <div className="flex flex-col items-end min-w-20">
          <span>{formatPrice(item.product.price * item.quantity)}</span>
          {/* <span>{item.quantity}</span> */}
          <span className="line-through text-muted-foreground">
            {formatPrice(item.product.priceCompare * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
