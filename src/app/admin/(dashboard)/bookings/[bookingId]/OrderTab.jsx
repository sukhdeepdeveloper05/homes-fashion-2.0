import { MEDIA_URL } from "@/config/Consts";
import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";
import React from "react";
import { PiImage } from "react-icons/pi";

export default function OrderTab({ orderItem, isLoading }) {
  return (
    <div>
      <div className="flex gap-4">
        {orderItem?.product?.featuredImage?.src ? (
          <Image
            src={`${MEDIA_URL}${orderItem.product.featuredImage.src}`}
            alt={orderItem.product.featuredImage.altText}
            width={400}
            height={400}
            className="rounded-lg border object-contain"
          />
        ) : (
          <div className="flex items-center justify-center size-[400px] rounded-lg bg-gray-300">
            <PiImage className="size-8" />
          </div>
        )}
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-2xl">{orderItem?.product?.title}</h2>
          <p className="text-sm text-foreground-secondary">
            #{orderItem?.product?.id}
          </p>
          <p className="">
            <span className="font-bold">Description: </span>
            {orderItem?.product?.description}
          </p>
          <p>
            <span className="font-bold">Price: </span>
            {formatPrice(orderItem?.pricePerItem)}
          </p>
          <p>
            <span className="font-bold">Quantity: </span>
            {orderItem?.quantity}
          </p>

          <p>
            <span className="font-bold">Total Price: </span>
            {formatPrice(orderItem?.totalPrice)}
          </p>
        </div>
      </div>
    </div>
  );
}
