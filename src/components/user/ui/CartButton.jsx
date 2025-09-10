import { ShoppingCart } from "lucide-react";
import { Badge } from "@/components/shadcn/badge";
import Link from "next/link";
import { useCartContext } from "@/store/cartContext";

export default function CartButton() {
  const { cart } = useCartContext();

  let count = cart?.items?.length || 0;

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center border border-input shadow size-10 rounded-full"
    >
      <ShoppingCart className="size-4 text-foreground-primary dark:text-background-primary" />

      {count > 0 && (
        <div className="absolute -top-1.5 -right-1.5">
          {/* Ping effect behind the badge */}
          <span className="absolute top-1/2 left-1/2 -translate-1/2 inline-flex size-[80%] rounded-full bg-red-500 opacity-75 animate-ping" />

          {/* Actual badge */}
          <Badge
            variant="destructive"
            className="relative rounded-full text-xs font-semibold flex items-center justify-center p-0 min-w-5 aspect-square"
          >
            {count}
          </Badge>
        </div>
      )}
    </Link>
  );
}
