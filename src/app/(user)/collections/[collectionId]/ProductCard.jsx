"use client";

import { Card, CardContent } from "@/components/shadcn/card";
import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";
import React, { useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { MEDIA_URL } from "@/config/Consts";
import { useProductContext } from "@/store/productContext";
import Button from "@/components/ui/Button";

export default function ProductCard({ product }) {
  const { setProduct } = useProductContext();

  return (
    <Card
      key={product.id}
      id={product.id}
      className="scroll-mt-[calc(var(--header-height)+2rem)] p-6 min-w-[440px] cursor-pointer"
      onClick={() => {
        setProduct(product);
      }}
    >
      <CardContent className="p-0">
        <div className="space-y-6">
          <div className="w-full rounded-xl overflow-hidden">
            <Image
              src={`${MEDIA_URL}${product.featuredImage?.src}`}
              width={1280}
              height={640}
              alt="Bathroom Cleaning"
              className="w-full object-cover aspect-[16/10]"
            />
          </div>
          <div className="w-full h-full flex justify-between items-start">
            <div>
              <h4 className="font-bold text-foreground-primary">
                {product.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {product.description}
              </p>
              <p className="text-sm mt-2">
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
                className="no-underline p-0 hover:opacity-80 mt-4"
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
