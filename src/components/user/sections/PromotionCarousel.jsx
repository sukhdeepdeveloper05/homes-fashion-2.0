"use client";

import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/shadcn/carousel";

export default function PromotionCarousel({
  items,
  className = "",
  textClassName = "text-2xl md:text-[26px] font-semibold uppercase",
  imageClassName = "size-10 md:size-12 object-contain",
}) {
  return (
    <Carousel
      autoScroll
      className={`border-b border-black/10 w-full overflow-hidden ${className}`}
    >
      <CarouselContent
        className="flex gap-8 md:gap-12 items-center whitespace-nowrap py-5 lg:py-8"
        slidesPerViewDesktop={4}
      >
        {[...items, ...items, ...items].map((item, index) => (
          <CarouselItem
            key={index}
            slideWidthAuto
            className="flex items-center justify-evenly gap-8 md:gap-12 text-center min-w-fit"
          >
            {item.image && (
              <Image
                src={item.image}
                alt={item.text}
                width={80}
                height={80}
                className={imageClassName}
              />
            )}
            <span className={textClassName}>{item.text}</span>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
