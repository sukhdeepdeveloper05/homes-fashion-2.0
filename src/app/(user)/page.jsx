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

export default async function HomePage() {
  const [paintingServicesRes, cleaningServicesRes, collectionsRes] =
    await Promise.all([
      getData({
        url: "/products",
        params: { collectionId: "68bee6d36f8cd90948e532a9" },
      }),
      getData({
        url: "/products",
        params: { collectionId: "6873c643a60ff627016702ee" },
      }),
      getData({
        url: "/collections",
        params: { sortBy: "updatedAt", sortDir: "desc" },
      }),
    ]);

  const { data: paintingServices } = paintingServicesRes;
  const { data: cleaningServices } = cleaningServicesRes;
  const { data: collections } = collectionsRes;

  return (
    <>
      <HeroSection collections={collections} />

      <section className="container mb-20">
        <Carousel opts={{ loop: false }}>
          <CarouselContent
            gap="2rem"
            slidesPerView={3}
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
      </section>

      <ItemsCarouselSection
        wrapperClass="container my-0 mb-20"
        heading="Cleaning Services"
        items={cleaningServices}
        collectionId="6873c643a60ff627016702ee"
        moreUrl={`/collections/6873c643a60ff627016702ee`}
      />

      <div className="container mb-20">
        <Image
          src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_template/w_1232,dpr_4,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/supply/customer-app-supply/1752250436156-db21b3.jpeg"
          alt=""
          width={1280}
          height={100}
          className="w-full"
        />
      </div>

      <ItemsCarouselSection
        wrapperClass="container my-0 mb-20"
        heading="Cleaning and Pest Control"
        items={paintingServices}
        collectionId="68bee6d36f8cd90948e532a9"
        moreUrl={`/collections/68bee6d36f8cd90948e532a9`}
      />
    </>
  );
}
