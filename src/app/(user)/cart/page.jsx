"use client";

import Button from "@/components/ui/Button";
import { Card, CardContent, CardFooter } from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCartContext } from "@/store/cartContext";
import { MEDIA_URL } from "@/config/Consts";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";
import { SkeletonBox } from "@/components/ui/Skeletons";
import CartIcon from "@/assets/icons/Cart";
import AuthModal from "@/components/user/modals/Auth";
import { useState } from "react";

function LoadingContent() {
  return (
    <div className="space-y-4">
      {[1].map((i) => (
        <Card key={i} className="shadow-sm border gap-0 p-6">
          <CardContent className="flex flex-col gap-0 p-0">
            <div className="flex items-center gap-4 pb-4">
              <SkeletonBox className="w-20 h-20 rounded-md" />
              <div className="flex-1 space-y-2">
                <SkeletonBox className="w-40 h-5 rounded-md" />
                <SkeletonBox className="w-28 h-4 rounded-md" />
                <SkeletonBox className="w-28 h-4 rounded-md" />
              </div>
            </div>
            <Separator />
          </CardContent>

          <CardFooter className="flex justify-between p-0 pt-4 gap-3">
            <SkeletonBox className="h-[46px] flex-1 rounded-md" />
            <SkeletonBox className="h-[46px] flex-1 rounded-md" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
export default function CartPage() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { cart, removeFromCart, isLoaded, isLoggedIn, isDeleting } =
    useCartContext();

  return (
    <div className="container max-w-2xl mx-auto py-8 flex-1 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <ShoppingCart className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">Your cart</h1>
      </div>

      {!isLoaded && <LoadingContent />}

      {isLoaded && cart.items.length < 1 && (
        <div className="flex items-center justify-center flex-col gap-4 flex-1 min-h-52">
          <CartIcon className="w-1/4" />
          <p className="text-xl font-semibold">Cart is empty</p>
        </div>
      )}

      {isLoaded && cart.items.length > 0 && (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <Card key={item.id} className="shadow-sm border gap-0 p-6">
              <CardContent className="flex flex-col gap-0 p-0">
                <div className="flex items-center gap-4 pb-4">
                  <Image
                    src={MEDIA_URL + item.product.featuredImage.src}
                    alt={item.product.title}
                    width={400}
                    height={400}
                    className="rounded-md object-cover aspect-square w-20"
                  />
                  <div className="space-y-1.5">
                    <h2 className="text-xl font-bold">{item.product.title}</h2>
                    <p className="text-muted-foreground">
                      Quantity {item.quantity} x{" "}
                      {formatPrice(item?.pricePerItem || item.product.price)}
                    </p>
                    <p className=" text-foreground-primary font-medium">
                      Total Price: {formatPrice(item?.totalPrice)}
                    </p>
                  </div>
                </div>
                <Separator />
              </CardContent>

              <CardFooter className="flex justify-between p-0 pt-4 gap-3">
                <Button
                  className="flex-1"
                  variant="foreground"
                  appearance="outline"
                  onClick={() => {
                    removeFromCart(item.id);
                  }}
                  isLoading={isDeleting}
                >
                  Remove
                </Button>
                {isLoggedIn ? (
                  <Link
                    href={`/checkout/${item.id}`}
                    className="button inline-flex items-center justify-center gap-2 relative button-medium button-primary__solid flex-1"
                  >
                    Checkout
                  </Link>
                ) : (
                  <button
                    onClick={() => setIsOpen(true)}
                    className="button inline-flex items-center justify-center gap-2 relative button-medium button-primary__solid flex-1"
                  >
                    Checkout
                  </button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {!isLoggedIn && <AuthModal open={isOpen} onOpenChange={setIsOpen} />}
    </div>
  );
}
