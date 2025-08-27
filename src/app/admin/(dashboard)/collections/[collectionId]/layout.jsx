"use client";

import { use } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BiChevronLeft } from "react-icons/bi";
import { useDetailsQuery, useUpdateMutation } from "@/hooks/queries";
import { CardSkeleton } from "@/components/ui/Skeletons";
import DropZone from "@/components/ui/fields/DropZone";
import { queryClient } from "@/services/Providers";
import { motion } from "framer-motion";

import { Tabs, TabsList, TabsTrigger } from "@/components/shadcn/tabs";

const TABS = [
  { name: "General", slug: "" },
  { name: "Products", slug: "products" },
];

export default function CollectionLayout({ children, params }) {
  const { collectionId } = use(params);
  const pathname = usePathname();

  const { data: { details = {} } = {}, isLoading } = useDetailsQuery(
    "collection",
    "/collections",
    { collectionId },
    false
  );

  const updateCollectionMutation = useUpdateMutation(
    "collection",
    "/collections"
  );

  const selectedTab = TABS.find(
    (tab) =>
      pathname.endsWith(`/${tab.slug}`) ||
      (tab.slug === "" && pathname === `/admin/collections/${collectionId}`)
  );

  return (
    <>
      <h4 className="flex items-center font-bold text-xl mb-5">
        <Link href="/admin/collections" className="mr-1">
          <BiChevronLeft fontSize={24} />
        </Link>
        Collection Details
      </h4>

      <div className="w-full flex flex-col lg:flex-row items-start gap-5">
        <>
          {isLoading && <CardSkeleton />}
          {/* Left Sidebar */}
          {!isLoading && (
            <div className="max-w-80 w-full flex flex-col gap-6 rounded-xl bg-white px-4 py-6 md:px-6 text-center flex-shrink-0">
              <div className="cursor-pointer">
                <DropZone
                  name="featuredImage"
                  label=""
                  initial={[details?.featuredImage]}
                  onChange={async (files) => {
                    await updateCollectionMutation.mutateAsync({
                      id: collectionId,
                      values: { featuredImage: files },
                    });
                  }}
                  key="featuredImage"
                  shapeClass="!size-full aspect-square mx-auto"
                  imageClass="!object-cover"
                  imageProps={{
                    priority: true,
                  }}
                />
              </div>
              <div>
                <p className="text-lg font-medium text-foreground-primary mb-2">
                  {details.title}
                </p>
                <p className="text-md font-medium text-foreground-secondary">
                  Products Count: {details.productsCount}
                </p>
              </div>
            </div>
          )}
        </>

        <div className="w-full rounded-xl bg-white px-4 py-5 md:px-6 min-h-full">
          <Tabs
            value={selectedTab?.slug ?? ""}
            className="w-full"
            activationMode="manual"
          >
            <TabsList className="bg-white flex gap-2 mb-6 border-b border-gray-200 overflow-x-scroll lg:overflow-auto p-0">
              {TABS.map((tab) => (
                <Link
                  key={tab.slug}
                  href={
                    tab.slug
                      ? `/admin/collections/${collectionId}/${tab.slug}`
                      : `/admin/collections/${collectionId}`
                  }
                  prefetch
                  passHref
                >
                  <TabsTrigger
                    value={tab.slug}
                    className="text-base whitespace-nowrap relative font-semibold data-[state=active]:text-foreground-primary text-foreground-secondary border-0 inline-flex h-full p-0 px-5 pb-3"
                  >
                    {tab.name}
                    {selectedTab?.slug === tab.slug && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground-primary rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 800,
                          damping: 25,
                        }}
                      />
                    )}
                  </TabsTrigger>
                </Link>
              ))}
            </TabsList>
          </Tabs>

          {children}
        </div>
      </div>
    </>
  );
}
