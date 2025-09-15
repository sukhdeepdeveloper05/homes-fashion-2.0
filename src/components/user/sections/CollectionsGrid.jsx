"use client";

import Image from "next/image";
import Link from "next/link";
import { MEDIA_URL } from "@/config/Consts";

export default function CollectionsGrid({ collections }) {
  return (
    <section className="py-12 md:py-16 xl:py-20 max-sm:mb-5">
      <div className="container">
        <div className="flex items-center justify-between max-md:flex-col max-md:gap-2 mb-6 md:mb-8">
          <h2 className="text-[26px] md:text-3xl font-bold">Our Services</h2>
          {/* <Link
            href="/collections"
            className="text-sm text-primary hover:underline"
          >
            View all services →
          </Link> */}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.id}`}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition"
            >
              <Image
                src={MEDIA_URL + collection.featuredImage.src}
                alt={collection.title}
                width={600}
                height={400}
                className="w-full h-84 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-semibold">{collection.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
