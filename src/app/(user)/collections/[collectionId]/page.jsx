import { Card, CardContent } from "@/components/shadcn/card";
import CartCard from "@/components/user/ui/CartCard";
import { MEDIA_URL } from "@/config/Consts";
import { getData } from "@/lib/api";
import Image from "next/image";
import { cache } from "react";
import { FaCheck } from "react-icons/fa6";
import ProductCard from "./ProductCard";

export const revalidate = 0;

const getCollectionDetails = cache(async (collectionId) => {
  return getData({ url: "/collections", params: { collectionId } });
});

export async function generateMetadata({ params }) {
  const { collectionId } = await params;
  const { data: details } = await getCollectionDetails(collectionId);

  return {
    title: `${details.title} | ${process.env.NEXT_PUBLIC_APP_NAME}`,
  };
}

export default async function CollectionPage({ params }) {
  const { collectionId } = await params;

  const [detailsRes, collectionProductsRes] = await Promise.all([
    getCollectionDetails(collectionId),
    getData({ url: "/products", params: { collectionId } }),
  ]);

  const { data: details } = detailsRes;
  const { data: collectionProducts } = collectionProductsRes;

  return (
    <div className="container py-8">
      <div className="grid grid-cols-12 gap-14">
        <main className="col-span-8 space-y-8">
          <h1 className="text-4xl text-foreground-primary font-semibold mb-8 text-center">
            {details.title}
          </h1>
          <div className="rounded-2xl overflow-hidden">
            <Image
              src={`${MEDIA_URL}${details.featuredImage?.src}`}
              width={1600}
              height={900}
              priority
              alt={details.featuredImage?.altText || details.title}
              className="object-cover object-bottom aspect-video"
            />
          </div>

          <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
            {collectionProducts.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </main>

        <aside className="col-span-4 sticky top-[calc(var(--header-height)+2rem)] ml-6 self-start space-y-3 min-w-96">
          <CartCard />

          <Card className="p-6">
            <CardContent className="p-0 flex justify-between">
              <div className="flex flex-col gap-3">
                <h3 className="text-xl text-foreground-primary font-semibold">
                  {process.env.NEXT_PUBLIC_APP_NAME} Promise
                </h3>
                <ul className="flex flex-col gap-1">
                  <li className="flex items-center text-sm">
                    <FaCheck className="mr-2" />
                    <span>Verified Professionals</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheck className="mr-2" />
                    <span>Hassle Free Booking</span>
                  </li>
                  <li className="flex items-center text-sm">
                    <FaCheck className="mr-2" />
                    <span>Transparent Pricing</span>
                  </li>
                </ul>
              </div>
              <div>
                <Image
                  src="https://res.cloudinary.com/urbanclap/image/upload/t_high_res_category/w_64,dpr_4,fl_progressive:steep,q_auto:low,f_auto,c_limit/images/growth/luminosity/1702985608819-4a9ba6.jpeg"
                  alt=""
                  width={64}
                  height={64}
                  className="aspect-square"
                />
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
