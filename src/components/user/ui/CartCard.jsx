"use client";

import { Card, CardContent } from "@/components/shadcn/card";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cartContext";
import { formatPrice } from "@/utils/formatPrice";
import QuantityButton from "./QuantityButton";
import Button from "@/components/ui/Button";
import { Separator } from "@/components/shadcn/separator";
import Link from "next/link";

export default function CartCard({
  icon,
  emptyMessage = "No items in your cart",
  className = "",
  emptyClassName = "",
  iconClassName = "w-1/4",
}) {
  const { cart } = useCart();

  const empyContent = (
    <div className="flex flex-col gap-1.5 items-center">
      <div className={cn("w-1/4", iconClassName)}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 128 96"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M77.5 34a.5.5 0 01-.5.5h-2.5V30a.5.5 0 011 0v3.5H77a.5.5 0 01.5.5z"
            fill="#FFD47F"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M79.5 34a.5.5 0 01-.5.5h-2.5V30a.5.5 0 011 0v3.5H79a.5.5 0 01.5.5z"
            fill="#FFD47F"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M73 69a1 1 0 011 1v1H61a1 1 0 00-1 1v7h-2v-7a3 3 0 013-3h12zm3 2h9a1 1 0 011 1v7h2v-7a3 3 0 00-3-3h-9.17c.11.313.17.65.17 1v1z"
            fill="#E2E2E2"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M60 60v10h-2V60h2z"
            fill="#E2E2E2"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M72 72a1 1 0 00-1-1H47a1 1 0 00-1 1v7h-2v-7a3 3 0 013-3h24a3 3 0 013 3v7h-2v-7z"
            fill="#E2E2E2"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M74 70v9h-2v-9h2z"
            fill="#E2E2E2"
          ></path>
          <path
            d="M50 79a5 5 0 11-10 0 5 5 0 0110 0zM64 79a5 5 0 11-10 0 5 5 0 0110 0zM78 79a5 5 0 11-10 0 5 5 0 0110 0zM92 79a5 5 0 11-10 0 5 5 0 0110 0z"
            fill="#757575"
          ></path>
          <path
            d="M48 79a3 3 0 11-6 0 3 3 0 016 0zM62 79a3 3 0 11-6 0 3 3 0 016 0zM76 79a3 3 0 11-6 0 3 3 0 016 0zM90 79a3 3 0 11-6 0 3 3 0 016 0z"
            fill="#EEE"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M74 60v10h-2V60h2z"
            fill="#E2E2E2"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M30.832 25.445l8 12-1.664 1.11-8-12 1.664-1.11zm16 0l8 12-1.664 1.11-8-12 1.664-1.11z"
            fill="#CBCBCB"
          ></path>
          <path
            d="M44 34h52l-5.694 30.369A2 2 0 0188.34 66H53.32a4 4 0 01-3.932-3.263L44 34z"
            fill="#CBCBCB"
          ></path>
          <path
            d="M34 34h48l-6 32H41.66a2 2 0 01-1.966-1.631L34 34z"
            fill="#E2E2E2"
          ></path>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M46 40h-2v7.059h2V40zm0 12.941h-2V60h2v-7.059zM50 40h2v7.059h-2V40zm2 12.941h-2V60h2v-7.059zM56 40h2v7.059h-2V40zm2 12.941h-2V60h2v-7.059zM62 40h2v7.059h-2V40zm2 12.941h-2V60h2v-7.059zM68 40h2v7.059h-2V40zm2 12.941h-2V60h2v-7.059z"
            fill="#fff"
          ></path>
          <path d="M24 24h28v4H24v-4z" fill="#97674E"></path>
          <path
            d="M78 20h6v4a6 6 0 01-6 6V20zM78 15a3 3 0 116 0v5h-6v-5zM78 30V18L66 30h12z"
            fill="#997BED"
          ></path>
          <path d="M88 16l-4-1v2l4-1z" fill="#FFD47F"></path>
          <path d="M81 15a1 1 0 112 0 1 1 0 01-2 0z" fill="#0F0F0F"></path>
          <path d="M72 30h-6l12-12v6a6 6 0 01-6 6z" fill="#6E42E5"></path>
        </svg>
      </div>
      <p className={cn("text-sm text-foreground-secondary/80", emptyClassName)}>
        {emptyMessage}
      </p>
    </div>
  );

  return (
    <Card className="p-6">
      <CardContent className={cn("p-0", className)}>
        {!cart.items.length && empyContent}

        {cart.items.length > 0 && (
          <div>
            <h2 className="text-foreground-primary font-semibold text-xl">
              Cart
            </h2>
            <div className="flex flex-col gap-4 pb-6 mt-2">
              {cart.items.map((item) => (
                <CartCardItem key={item.id} item={item} />
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
                  <span className=" font-normal line-through">
                    {formatPrice(cart.totalPrice * 1.3)}
                  </span>
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
        {item.title}
      </span>
      <div className="flex items-center gap-4">
        <QuantityButton item={item} maxValue={3} className="h-8" />
        <div className="flex flex-col items-end min-w-20">
          <span>{formatPrice(item.price * item.quantity)}</span>
          {/* <span>{item.quantity}</span> */}
          <span className="line-through text-muted-foreground">
            {formatPrice(
              item.compareAtPrice || item.price * item.quantity * 1.3
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
