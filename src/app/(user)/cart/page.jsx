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
import { useCart } from "@/store/cartContext";
import { MEDIA_URL } from "@/config/Consts";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/utils/formatPrice";

// Mock cart data (replace with real hook or API later)
const cartItems = [
  {
    id: 1,
    title: "AC Service & Repair",
    servicesCount: 1,
    price: 998,
    items: ["Foam-jet service (2 ACs) x 1"],
    image: "/images/ac.png",
  },
  {
    id: 2,
    title: "Bathroom & kitchen cleaning",
    servicesCount: 1,
    price: 785,
    items: ["Classic cleaning (2 bathrooms) x 1"],
    image: "/images/bathroom.png",
  },
  {
    id: 3,
    title: "Bathroom Cleaning",
    servicesCount: 2,
    price: 2397,
    items: [
      "3 visits: Intense bathroom cleaning x 1",
      "Intense bathroom cleaning x 1",
    ],
    image: "/images/cleaning.png",
  },
  {
    id: 4,
    title: "Full Home/ Move-in Cleaning",
    servicesCount: 1,
    price: 3499,
    items: ["Furnished apartment x 1"],
    image: "/images/home.png",
  },
  {
    id: 5,
    title: "Salon Luxe",
    servicesCount: 1,
    price: 1399,
    items: ["Roll-on waxing (Full arms & legs, underarm) x 1"],
    image: "/images/salon.png",
  },
];

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart } = useCart();

  return (
    <div className="container max-w-2xl mx-auto py-8">
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

      {/* Cart Items */}
      <div className="space-y-4">
        {cart.items.map((item) => (
          <Card key={item.id} className="shadow-sm border gap-0 p-6">
            <CardContent className="flex flex-col gap-0 p-0">
              <div className="flex items-center gap-4 pb-4">
                <Image
                  src={MEDIA_URL + item.featuredImage.src}
                  alt={item.title}
                  width={400}
                  height={400}
                  className="rounded-md object-cover aspect-square w-20"
                />
                <div>
                  <h2 className="text-2xl font-bold">{item.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    Quantity {item.quantity} • Price{" "}
                    {formatPrice(item.price * item.quantity)}
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
