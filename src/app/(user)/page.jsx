import Image from "next/image";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/shadcn/carousel";
import ItemsCarouselSection from "@/components/user/sections/ItemsCarouselSection";
import { getData } from "@/lib/api";
import HeroSection from "@/components/user/sections/Hero";
import PromotionCarousel from "@/components/user/sections/PromotionCarousel";
import hammer from "@/assets/images/hammer.png";
import paintBrush from "@/assets/images/paint-brush.png";
import vaccumCleaner from "@/assets/images/vaccum-cleaner.png";
import CollectionsGrid from "@/components/user/sections/CollectionsGrid";

import cleaningTeam from "@/assets/images/cleaning-team.webp";

export const revalidate = 0;

export const metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME} - Get Expert Professional Services at Home`,
};

const SLIDES = [
  {
    src: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_4,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1751349785134-9a43cd.jpeg",
  },
  {
    src: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_4,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1745848360087-3d3d8e.jpeg",
  },
  {
    src: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_4,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1754911752088-65ca51.jpeg",
  },
  {
    src: "https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_394,dpr_4,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/home-screen/1711428209166-2d42c0.jpeg",
  },
];

const promoItems = [
  {
    text: "Walls Painted With Perfection",
    image: paintBrush,
  },
  {
    text: "Fresh Homes, Happy Living",
    image: vaccumCleaner,
  },
  {
    text: "Upgrade Your Home Today",
    image: hammer,
  },
];

export default async function HomePage() {
  const [
    paintingServicesRes,
    cleaningServicesRes,
    renovationServicesRes,
    collectionsRes,
  ] = await Promise.all([
    getData({
      url: "/products",
      params: { collectionId: "68bee6d36f8cd90948e532a9" },
    }),
    getData({
      url: "/products",
      params: { collectionId: "6873c643a60ff627016702ee" },
    }),
    getData({
      url: "/products",
      params: { collectionId: "68c6cd986b7f9ed03ff446f6" },
    }),
    getData({
      url: "/collections",
      // params: { sortBy: "updatedAt", sortDir: "desc" },
    }),
  ]);

  const { data: paintingServices } = paintingServicesRes;
  const { data: cleaningServices } = cleaningServicesRes;
  const { data: renovationServices } = renovationServicesRes;
  const { data: collections } = collectionsRes;

  return (
    <div className="mt-(--header-height)">
      <HeroSection collections={collections} />
      <PromotionCarousel items={promoItems} autoplay={true} interval={2500} />

      <CollectionsGrid collections={collections} />

      {/* <section className="container mt-20 mb-20">
        <Carousel opts={{ loop: false }}>
          <CarouselContent
            gap="2rem"
            slidesPerViewDesktop={3}
            className="max-2xl:[--carousel-item-basis:calc(100%/(var(--slides-per-view)-1))]"
          >
            {SLIDES.map((slide) => (
              <CarouselItem
                className="cursor-pointer rounded-xl relative"
                key={"slide-" + slide.src + "-item"}
              >
                <Image
                  src={slide.src}
                  alt=""
                  width={1920}
                  height={640}
                  className="w-full hover:scale-[102%] transition-transform duration-300"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious hideWhenDisabled />
          <CarouselNext hideWhenDisabled />
        </Carousel>
      </section> */}

      <ItemsCarouselSection
        wrapperClass="container my-0 mb-16 md:mb-20"
        heading="Cleaning Services"
        items={cleaningServices}
        collectionId="6873c643a60ff627016702ee"
        moreUrl={`/collections/6873c643a60ff627016702ee`}
      />

      {/* <div className="container mb-20">
        <Image
          src={cleaningTeam}
          alt="Cleaning Team"
          width={1280}
          height={100}
          className="w-full"
        />
      </div> */}

      <ItemsCarouselSection
        wrapperClass="container my-0 mb-16 md:mb-20"
        heading="Painting Services"
        items={paintingServices}
        collectionId="68bee6d36f8cd90948e532a9"
        moreUrl={`/collections/68bee6d36f8cd90948e532a9`}
      />
      <ItemsCarouselSection
        wrapperClass="container my-0 mb-16 md:mb-20"
        heading="Renovation Services"
        items={renovationServices}
        collectionId="68c6cd986b7f9ed03ff446f6"
        moreUrl={`/collections/68c6cd986b7f9ed03ff446f6`}
      />
    </div>
  );
}
