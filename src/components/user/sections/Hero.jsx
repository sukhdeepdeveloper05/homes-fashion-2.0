import heroBanner from "@/assets/images/hero-banner.png";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import Image from "next/image";
import { MEDIA_URL } from "@/config/Consts";
import Link from "next/link";

export default function HeroSection({ services, collections }) {
  return (
    <section className="hero bg-black text-white max-h-[600px] relative mb-50 -mt-(--header-height)">
      <Image
        src={heroBanner}
        priority
        alt=""
        width={1280}
        height={100}
        className="w-full object-cover object-top h-full absolute inset-0"
      />

      <div className="container mx-auto">
        <div className="pt-44 relative z-10 max-w-3xl mx-auto">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">
              Fast, Free way to get experts
            </h1>
            <p className="text-2xl">Discover Top Experts in</p>
            <p className="text-accent-secondary font-bold text-2xl">
              Skilled, Trusted, Reliable!
            </p>
          </div>

          <div className="bg-white rounded-lg flex items-center px-4 py-3.5 mt-14">
            <div className="flex items-center gap-1.5 max-w-3xs w-full">
              <HiOutlineLocationMarker className="text-xl text-foreground-tertiary min-w-5" />
              <input
                type="text"
                placeholder="Search for a city..."
                className="text-foreground-primary text-sm w-full inline-flex"
              />
            </div>

            <div className="devider min-w-0.5 h-7 mx-1 bg-foreground-tertiary/20 rounded-full" />

            <div className="flex items-center gap-1.5 pl-3.5 w-full">
              <FiSearch className="text-xl text-foreground-tertiary min-w-5" />
              <input
                type="text"
                placeholder="Find your service"
                className="text-foreground-primary text-sm w-full"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-20 bg-white rounded-xl shadow-[0_4px_4px_0px_rgb(0,0,0,0.10)] max-w-7xl mx-auto">
          <div className="bg-background-secondary py-5 rounded-t-xl">
            <h3 className="text-foreground-primary font-bold text-center">
              What are you looking for?
            </h3>
          </div>

          <div className="flex justify-between py-5 px-12">
            {collections.slice(0, 8).map((collection) => (
              <Link
                href={`/collections/${collection.id}`}
                key={collection.id}
                className="max-w-28"
              >
                <Image
                  src={MEDIA_URL + collection.featuredImage.src}
                  alt=""
                  width={320}
                  height={320}
                  className="aspect-[1.24/1] object-cover rounded-lg w-28"
                />
                <p className="text-foreground-primary text-sm font-medium text-center mt-2 truncate line-clamp-1">
                  {collection.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
