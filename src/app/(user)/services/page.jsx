import ItemsCarouselSection from "@/components/user/sections/ItemsCarouselSection";
import { getData } from "@/lib/api";
import React from "react";

export default async function ServicesPage() {
  const { data } = await getData({
    url: "/collections",
    params: { sortBy: "createdAt", sortDir: "asc" },
  });

  return (
    <div className="py-16 flex flex-col gap-10">
      {data.map((collection) => (
        <ItemsCarouselSection
          key={collection.id}
          wrapperClass="container my-0"
          heading={collection.title}
          dataKey={`products`}
          collectionId={collection.id}
          moreUrl={`/collections/${collection.id}`}
        />
      ))}
    </div>
  );
}
