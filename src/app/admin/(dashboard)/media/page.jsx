"use client";

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
import { useState } from "react";
import { FiLoader } from "react-icons/fi";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

export default function MediaPage() {
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
      perPage: 32,
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

  const { ref: inViewRef } = useInView({
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  if (media.length === 0 && !isFetching) return <div>No media found</div>;

  const toggleSelect = (id) => {
    setSelected((prev) => {
      return prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
    });
  };

  const deleteSelected = async () => {
    await deleteMutation.mutateAsync({ body: { mediaIds: selected } });
  };

  return (
    <>
      {/* Sticky header */}
      <div className="sticky -top-8 -left-8 -right-8 z-20 bg-white border-b rounded-lg shadow-sm flex md:flex-row flex-col md:items-center justify-between p-3 gap-4">
        <div className="flex items-center gap-2 max-md:flex-1">
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
          buttonClass="px-3.5 py-2.5 text-white font-semibold"
          title="Delete Media"
          description="Are you sure you want to delete the selected media? This action cannot be undone."
          disabled={!selected.length}
          isLoading={deleteMutation.isPending}
        >
          Delete Selected ({selected.length})
        </DeleteButton>
      </div>

      {/* Masonry grid */}
      <div className="grid grid-cols-3 lg:grid-cols-6 2xl:grid-cols-8 gap-4 py-4 md:py-8">
        {media.map((item, idx) => {
          const isSelected = selected.includes(item.id);
          return (
            <div
              key={item.id + idx}
              onClick={() => toggleSelect(item.id)}
              className={cn(
                "relative group cursor-pointer select-none flex rounded-xl overflow-hidden duration-300 aspect-square bg-white border-2 border-gray-100 transition-all",
                isSelected && "border-primary"
              )}
            >
              <Checkbox
                checked={isSelected}
                onChange={() => toggleSelect(item.id)}
                className="absolute top-2 left-2"
                inputClass="bg-background-primary border-gray-300"
              />
              {item.mediaType === "image" ? (
                <Image
                  src={MEDIA_URL + item.src}
                  alt={item.title}
                  width={600}
                  height={600}
                  className="object-contain"
                />
              ) : (
                <video
                  src={MEDIA_URL + item.src}
                  controls
                  className="object-contain"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Infinite scroll loader */}
      <div
        ref={inViewRef}
        className="h-10 w-full flex items-center justify-center"
      >
        {isFetchingNextPage ? (
          <FiLoader className="animate-spin size-8" />
        ) : null}
      </div>
    </>
  );
}
