"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadcn/carousel";
import { SkeletonBox } from "@/components/ui/Skeletons";
import { MEDIA_URL } from "@/config/Consts";
import { useListQuery } from "@/hooks/queries";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

// 🟢 Skeleton Card
function ProductCardSkeleton({ id }) {
  return (
    <div>
      <SkeletonBox className="w-full aspect-square rounded-md bg-gray-200" />
      <div className="mt-2 space-y-2">
        <SkeletonBox className="h-5 w-3/4 bg-gray-200 rounded" />
        <SkeletonBox className="h-4 w-1/2 bg-gray-200 rounded" />
        <SkeletonBox className="h-6 w-1/3 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

function ProductCard({ item, collectionId }) {
  return (
    <Link href={`/collections/${collectionId}`} className="">
      <div className="relative w-full aspect-square rounded-md overflow-hidden select-none">
        {item?.featuredImage?.src ? (
          <Image
            src={MEDIA_URL + item.featuredImage.src}
            alt={item.featuredImage.altText || item.title}
            fill
            sizes="400px"
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            No Image
          </div>
        )}
      </div>

      <div className="mt-2 flex flex-col">
        <h2 className="text-xl font-semibold text-foreground-primary">
          {item.title}
        </h2>
        <span className="text-sm text-foreground-primary flex items-center gap-1 mb-1">
          <FaStar className="text-[#FFC02D] size-3" />
          <span>{/* {item.rating} */}3.3</span>
          <span>({/* {item.ratingCount} */}3k reviews)</span>
        </span>
        <p className="text-foreground-primary text-lg font-semibold">
          {formatPrice(item.price)}
        </p>
      </div>
    </Link>
  );
}

export default function ItemsCarouselSection({
  heading,
  items,
  collectionId,
  moreUrl = "",
  wrapperClass = "",
  headingClass = "",
  itemsContentClass = "",
  itemClass = "",
  dataKey = "",
}) {
  const { data, isLoading } = useListQuery({
    key: dataKey,
    url: dataKey,
    handle: "items",
    queryKey: ["products", collectionId],
    requiresAuth: false,
    params: { collectionId },
    queryOptions: {
      enabled: !items,
    },
  });

  const slides = items || data?.items || [];

  return (
    <section className={cn("w-full", wrapperClass)}>
      <div className="flex items-center justify-between mb-4">
        {heading && (
          <h1 className={cn("text-3xl font-bold", headingClass)}>{heading}</h1>
        )}
        <Link
          href={moreUrl}
          className="text-sm text-foreground-primary border border-gray-300 hover:border-gray-400 px-3 py-1.5 rounded-md transition-colors"
        >
          See all
        </Link>
      </div>

      {isLoading ? (
        // 🟢 Skeleton carousel while loading
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductCardSkeleton key={collectionId + i} id={collectionId + i} />
          ))}
        </div>
      ) : (
        <Carousel>
          <CarouselContent
            gap="1rem"
            slidesPerView={5}
            className={cn(itemsContentClass)}
          >
            {slides.map((item, idx) => (
              <CarouselItem
                key={collectionId + item.slug + idx}
                className={cn(itemClass)}
              >
                <ProductCard collectionId={collectionId} item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious hideWhenDisabled />
          <CarouselNext hideWhenDisabled />
        </Carousel>
      )}
    </section>
  );
}
