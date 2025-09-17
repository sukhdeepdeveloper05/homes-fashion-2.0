"use client";
import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/shadcn/button";
import Autoplay from "embla-carousel-autoplay";
import AutoScroll from "embla-carousel-auto-scroll";

const CarouselContext = React.createContext(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins = [],
  autoPlay = false,
  autoScroll = false,
  delay = 4000,
  className,
  children,
  autoPlayProps = {},
  autoScrollProps = {},
  ...props
}) {
  const autoPlayPlugin = autoPlay
    ? [
        Autoplay({
          playOnInit: true,
          stopOnInteraction: false,
          stopOnFocusIn: false,
          delay,
          ...autoPlayProps,
        }),
      ]
    : [];
  const autoScrollPlugin = autoScroll
    ? [
        AutoScroll({
          playOnInit: true,
          loop: true,
          stopOnInteraction: false,
          stopOnFocusIn: false,
          stopOnMouseEnter: true,
          startDelay: 0,
          ...autoScrollProps,
        }),
      ]
    : [];

  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
      
    },
    [...autoPlayPlugin, ...autoScrollPlugin, ...plugins]
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext]
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({
  className,
  slidesPerViewDesktop = 5,
  slidesPerViewTablet = 2,
  slidesPerViewMobile = 1,
  gap,
  ...props
}) {
  const { carouselRef, orientation } = useCarousel();

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden rounded-md"
      data-slot="carousel-content"
    >
      <div
        style={{
          "--carousel-item-spacing": gap,
          "--slides-per-view-desktop": slidesPerViewDesktop,
          "--slides-per-view-tablet": slidesPerViewTablet,
          "--slides-per-view-mobile": slidesPerViewMobile,
        }}
        className={cn(
          "flex",
          orientation === "horizontal"
            ? "-ml-(--carousel-item-spacing)"
            : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({
  slideWidthAuto = false,
  className,
  children,
  ...props
}) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0",
        !slideWidthAuto &&
          `basis-[calc(100%/var(--slides-per-view-mobile))] lg:basis-[calc(100%/var(--slides-per-view-tablet))] xl:basis-[calc(100%/var(--slides-per-view-desktop))]`,
        orientation === "horizontal" ? "pl-(--carousel-item-spacing)" : "pt-4"
      )}
      {...props}
    >
      <div className={cn("overflow-hidden", className)}>{children}</div>
    </div>
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon",
  hideWhenDisabled = false,
  ...props
}) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return hideWhenDisabled && !canScrollPrev ? null : (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-10 bg-white hover:bg-white rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -left-5 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon",
  hideWhenDisabled = false,
  ...props
}) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return hideWhenDisabled && !canScrollNext ? null : (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute size-10 bg-white hover:bg-white rounded-full",
        orientation === "horizontal"
          ? "top-1/2 -right-5 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
