import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadcn/carousel";
import { MEDIA_URL } from "@/config/Consts";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/utils/formatPrice";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

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
  items = [],
  collectionId,
  moreUrl = "",
  wrapperClass = "",
  headingClass = "",
  itemsClass = "",
  itemClass = "",
}) {
  return (
    <section className={cn("w-full my-12", wrapperClass)}>
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

      <Carousel>
        <CarouselContent
          gap="1rem"
          slidesPerView={5}
          className={cn(itemsClass)}
        >
          {items.map((item, idx) => {
            return (
              <CarouselItem key={item.slug + idx} className={cn(itemClass)}>
                <ProductCard collectionId={collectionId} item={item} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
        <CarouselPrevious hideWhenDisabled />
        <CarouselNext hideWhenDisabled />
      </Carousel>
    </section>
  );
}
