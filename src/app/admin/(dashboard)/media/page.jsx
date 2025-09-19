"use client";

import Button from "@/components/ui/Button";
import DeleteButton from "@/components/ui/DeleteButton";
import Checkbox from "@/components/ui/fields/Checkbox";
import SelectField from "@/components/ui/fields/SelectField";

import { MEDIA_URL } from "@/config/Consts";
import {
  invalidateQueries,
  useDeleteMutation,
  useInfiniteListQuery,
} from "@/hooks/queries";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useRef, useEffect, useState } from "react";
import { FiCheck, FiLoader } from "react-icons/fi";
import { toast } from "sonner";

export default function MediaPage() {
  const observerRef = useRef();
  const [selected, setSelected] = useState([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const {
    data: { media = [] } = {},
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteListQuery({
    handle: "media",
    url: "/media",
    queryKey: ["media", sortBy, sortDir], // refetch when sort changes
    requiresAuth: true,
    params: {
      perPage: 20,
      sortBy,
      sortDir,
    },
  });

  const deleteMutation = useDeleteMutation({
    handle: "media",
    url: "/media",
    mutationOptions: {
      onSuccess: () => {
        toast.success("Media deleted successfully");
        invalidateQueries("media");
        setSelected([]);
      },
    },
  });

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        !isFetching &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    });

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, media]);

  if (media.length === 0 && !isFetching) return <div>No media found</div>;

  const toggleSelect = (id) => {
    setSelected((prev) => {
      return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
    });
  };

  const deleteSelected = () => {
    selected.forEach((id) => deleteMutation.mutate(id));
  };

  return (
    <>
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white border-b rounded-lg shadow-sm flex items-center justify-between p-3 gap-4">
        <div className="flex items-center gap-2">
          <SelectField
            value={sortBy}
            onChange={(val) => setSortBy(val)}
            options={[
              { label: "Created At", value: "createdAt" },
              { label: "Updated At", value: "updatedAt" },
            ]}
          />
          <SelectField
            value={sortDir}
            onChange={(val) => setSortDir(val)}
            options={[
              { label: "Descending", value: "desc" },
              { label: "Ascending", value: "asc" },
            ]}
          />
        </div>

        <DeleteButton
          onDelete={deleteSelected}
          showDialog={true}
          buttonClass="px-3 py-2 text-white font-semibold"
        >
          Delete Selected ({selected.length})
        </DeleteButton>
      </div>

      {/* Masonry grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-6 gap-4 p-4">
        {media.map((item, idx) => {
          const isSelected = selected.includes(item.id);
          return (
            <div
              key={item.id + idx}
              onClick={() => toggleSelect(item.id)}
              className={`relative group cursor-pointer select-none flex rounded-xl overflow-hidden border transition-all duration-300 aspect-square bg-white`}
            >
              <div
                className={cn(
                  "absolute inset-0 group-hover:opacity-100 bg-black/30 flex items-center justify-center z-10 transition-opacity duration-300",
                  { "opacity-0": !isSelected }
                )}
              >
                {isSelected && <FiCheck className="text-white text-3xl" />}
              </div>
              <Image
                src={MEDIA_URL + item.src}
                alt={item.title}
                width={600}
                height={600}
                className="object-contain"
              />
              <Checkbox
                value={item.id}
                checked={isSelected}
                className="hidden"
              />
            </div>
          );
        })}
      </div>

      {/* Infinite scroll loader */}
      <div
        ref={observerRef}
        className="h-10 w-full flex items-center justify-center"
      >
        {isFetchingNextPage ? (
          <FiLoader className="animate-spin size-8" />
        ) : null}
      </div>
    </>
  );
}
