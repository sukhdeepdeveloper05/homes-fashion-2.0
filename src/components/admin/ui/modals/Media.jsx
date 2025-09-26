"use client";

import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/shadcn/dialog";
import { useInfiniteListQuery } from "@/hooks/queries";
import { FiLoader } from "react-icons/fi";
import { MEDIA_URL } from "@/config/Consts";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/fields/Checkbox";
import { toast } from "sonner";
import DropZone from "@/components/ui/DropZone";

export default function MediaPickerModal({
  open,
  onClose,
  files = [],
  multi,
  max = 20,
  accept,
}) {
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState(files);

  const {
    data: { media = [] } = {},
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
  } = useInfiniteListQuery({
    handle: "media",
    url: "/media",
    queryKey: ["media"],
    requiresAuth: true,
    params: { perPage: 20, sortBy: "createdAt", sortDir: "desc" },
  });

  const { ref: inViewRef } = useInView({
    onChange: (inView) =>
      inView && hasNextPage && !isFetchingNextPage && fetchNextPage(),
  });

  useEffect(() => setSelectedFiles(files), [files, open]);

  const unchanged =
    files
      ?.map((f) => f.id)
      .sort()
      .join(",") ===
    selectedFiles
      ?.map((f) => f.id)
      .sort()
      .join(",");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        aria-describedby={undefined}
        showCloseButton={false}
        className="sm:max-w-11/12 xl:max-w-6xl max-w-11/12 h-[80vh] flex flex-col gap-0 p-0 overflow-hidden"
      >
        {/* Header */}
        <DialogHeader className="bg-background-secondary p-4 flex justify-between">
          <DialogTitle>Select File</DialogTitle>
          <DialogClose className="size-5" />
        </DialogHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-10">
          <DropZone
            className="my-6"
            accept={accept}
            setUploadingFiles={setUploadingFiles}
          />

          {isLoading ? (
            <Loader />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 xl:grid-cols-5 gap-4 pb-4">
              {[...uploadingFiles, ...media]?.map((item) => (
                <MediaItem
                  key={item.id}
                  item={item}
                  accept={accept}
                  multi={multi}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  max={max}
                />
              ))}
            </div>
          )}

          {hasNextPage && (
            <div ref={inViewRef} className="pb-4 flex justify-center">
              <FiLoader className="animate-spin size-8" />
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="bg-background-secondary p-4 flex justify-end">
          <Button
            size="small"
            variant="foreground"
            appearance="outline"
            onClick={() => onClose(false)}
          >
            Cancel
          </Button>
          <Button
            size="small"
            variant="foreground"
            appearance="solid"
            onClick={(e) => onClose(false, selectedFiles)}
            disabled={unchanged}
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Loader() {
  return (
    <div className="flex justify-center items-center h-full">
      <FiLoader className="animate-spin" size={24} />
    </div>
  );
}

function MediaItem({
  item,
  accept,
  multi,
  selectedFiles,
  setSelectedFiles,
  max,
}) {
  const isSelected = selectedFiles.some((f) => f.id === item.id);

  const isAllowed = (() => {
    if (!accept) return true;
    const type = item.mediaType;

    return Array.isArray(accept)
      ? accept.some((a) => a.split("/")[0] === type)
      : accept.split("/")[0] === type;
  })();

  const toggleSelect = () => {
    if (!isAllowed) return toast.error("File type not allowed");
    if (selectedFiles.length >= max && !isSelected)
      return toast.error(`Only ${max} files allowed`);

    setSelectedFiles((prev) =>
      multi
        ? isSelected
          ? prev.filter((f) => f.id !== item.id)
          : [...prev, item]
        : isSelected
        ? []
        : [item]
    );
  };

  return (
    <div
      className={cn(
        "relative rounded-md overflow-hidden border-2 transition-all",
        isSelected ? "border-primary" : "border-gray-100",
        isAllowed && "hover:border-primary cursor-pointer",
        item.isUploading && "opacity-50 animate-pulse"
      )}
      onClick={toggleSelect}
    >
      <Checkbox
        checked={isSelected}
        onChange={toggleSelect}
        className="absolute top-2 left-2"
      />
      {item.mediaType === "image" ? (
        <Image
          width={400}
          height={400}
          src={item.isUploading ? item.src : MEDIA_URL + item.src}
          alt={item.altText || item.title || item.id}
          className="w-full object-contain aspect-square"
        />
      ) : (
        <video
          src={item.isUploading ? item.src : MEDIA_URL + item.src}
          controls
          className="w-full object-contain aspect-square"
          onClick={(e) => e.preventDefault()}
        />
      )}
    </div>
  );
}
