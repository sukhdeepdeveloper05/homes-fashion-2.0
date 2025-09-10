"use client";

import Button from "@/components/ui/Button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/shadcn/card";
import { Separator } from "@/components/shadcn/separator";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCartContext } from "@/store/cartContext";
import { MEDIA_URL } from "@/config/Consts";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, isLoaded } = useCartContext();

  console.log(cart);
  if (!isLoaded) return <div>Cart Loading</div>;

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

      {cart.items.length < 1 && (
        <div className="flex items-center justify-center flex-col gap-4 flex-1">
          <p className="text-xl font-semibold">Cart is empty</p>
        </div>
      )}

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
                <div>
                  <h2 className="text-2xl font-bold">{item.product.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Quantity {item.quantity} • Total Price{" "}
                    {formatPrice(item.pricePerItem * item.quantity)}
                  </p>
                </div>
              </div>
              <Separator />
            </CardContent>

            <CardFooter className="flex justify-between p-0 pt-4 gap-3">
              <Button
                className="flex-1"
                variant="primary"
                appearance="outline"
                onClick={() => {
                  removeFromCart(item.id);
                }}
              >
                Remove
              </Button>
              <Link
                href={`/checkout/${item.id}`}
                className="button inline-flex items-center justify-center gap-2 relative button-medium button-primary__solid flex-1"
              >
                Checkout
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
