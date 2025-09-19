"use client";

import { Card, CardContent } from "@/components/shadcn/card";
import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";
import AddToCartButton from "./AddToCartButton";
import { MEDIA_URL } from "@/config/Consts";
import { useProductContext } from "@/store/productContext";
import Button from "@/components/ui/Button";
import { PiImage } from "react-icons/pi";

export default function ProductCard({ product }) {
  const { setProduct } = useProductContext();

  return (
    <Card
      key={product.id}
      id={product.id}
      className="scroll-mt-[calc(var(--header-height)+2rem)] p-0"
      // onClick={() => {
      //   setProduct(product);
      // }}
    >
      <CardContent className="p-0">
        <div>
          <div className="w-full rounded-t-xl overflow-hidden">
            {product?.featuredImage?.src ? (
              <Image
                src={`${MEDIA_URL}${product.featuredImage?.src}`}
                width={1280}
                height={640}
                alt="Bathroom Cleaning"
                className="w-full object-cover aspect-[16/10]"
              />
            ) : (
              <div
                width={1280}
                height={640}
                className="flex items-center justify-center w-full h-full aspect-[16/10] bg-gray-300"
              >
                <PiImage className="size-8" />
              </div>
            )}
          </div>
          <div className="w-full h-full flex justify-between items-start px-4 py-5">
            <div>
              <h4 className="text-xl font-bold text-foreground-primary">
                {product.title}
              </h4>
              {/* <p className="text-sm text-muted-foreground">
                {product.description}
              </p> */}
              <p className="mt-2">
                <span className="font-semibold mr-1">
                  Starts at {formatPrice(product.price)}
                </span>
                <span className="line-through text-muted-foreground font-normal">
                  {formatPrice(product.priceCompare)}
                </span>
              </p>
              <Button
                appearance="linkAccent"
                size="small"
                className="p-0 hover:opacity-80 mt-3 rounded-none"
                onClick={() => {
                  setProduct(product);
                }}
              >
                View Details
              </Button>
            </div>
            <AddToCartButton item={product}>Add</AddToCartButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
