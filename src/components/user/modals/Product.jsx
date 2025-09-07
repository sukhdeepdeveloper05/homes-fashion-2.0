"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import Image from "next/image";
import { Star, XIcon } from "lucide-react";
import { MEDIA_URL } from "@/config/Consts";
import { Separator } from "@/components/shadcn/separator";
import { Card } from "@/components/shadcn/card";
import Button from "@/components/ui/Button";
import Faqs from "../ui/Faqs";
import AddToCartButton from "@/app/(user)/collections/[collectionId]/AddToCartButton";

export default function ProductModal({ product, open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-full rounded-0 p-0 max-h-[80vh] flex flex-col bg-transparent shadow-none border-none"
        overlayClassName="overlay"
        showCloseButton={false}
        aria-describedby={undefined}
      >
        {product && (
          <div className="overflow-hidden rounded-2xl flex-1 flex flex-col bg-background-primary">
            <div className="overflow-auto">
              <div className="relative aspect-video w-full">
                <Image
                  src={MEDIA_URL + product.featuredImage.src}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
              </div>
              {/* Product Info */}
              <div className="sspace-y-4">
                <DialogHeader className="p-6 flex flex-row items-center justify-between">
                  <div>
                    <DialogTitle className="text-xl font-semibold">
                      {product.title}
                    </DialogTitle>
                    <div className="flex items-center text-sm text-muted-foreground gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{product?.rating || "4.5"}</span>
                      <span>({product?.reviews || "2k"} reviews)</span>
                    </div>
                  </div>
                  <div>
                    <AddToCartButton item={product}>Add</AddToCartButton>
                  </div>
                </DialogHeader>

                {product.discountText && (
                  <p className="text-green-600 text-sm font-medium">
                    {product?.discountText || "Add more & save up to 26%"}
                  </p>
                )}

                {product.media.length > 0 && (
                  <>
                    <Separator />
                    <div className="">
                      <div className="">
                        {product.media.map((img, idx) => (
                          <div key={idx} className="relative overflow-hidden">
                            <Image
                              src={MEDIA_URL + img.src}
                              alt="Before After"
                              width={700}
                              height={700}
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />
                <Faqs />
              </div>
            </div>
          </div>
        )}

        <DialogClose className="fixed -top-14 right-2 z-[1000] bg-white rounded-full p-2">
          <XIcon />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
