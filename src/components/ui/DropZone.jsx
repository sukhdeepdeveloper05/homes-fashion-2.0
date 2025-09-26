import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useUploadMutation } from "@/hooks/queries";
import { toast } from "sonner";
import { queryClient } from "@/services/Providers";
import { FiLoader, FiUpload } from "react-icons/fi";
import { MultiMediaPreview, SingleMediaPreview } from "./MediaPreview";

export default function DropZone({
  className = "",
  imageClass = "",
  shape = "auto",
  accept,
  multi,
  files = [],
  setUploadingFiles,
  onSuccess,
  showPreviews = false,
  onRemove = () => {},
  creatMedia = true,
}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const { mutateAsync: uploadMedia, isPending } = useUploadMutation();

  const handleUpload = async (selectedFiles) => {
    const filesToUpload = Array.from(
      selectedFiles || inputRef.current?.files || []
    );
    if (!filesToUpload.length) return;

    const isValidType = (file) => {
      if (!accept) return true;
      const type = file.type.split("/")[0];
      return Array.isArray(accept)
        ? accept.some((a) => type === a.split("/")[0])
        : type === accept.split("/")[0];
    };

    if (!filesToUpload.every(isValidType)) {
      toast.error("File type not allowed");
      return;
    }

    if (!creatMedia) {
      onSuccess?.(filesToUpload);
      return;
    }

    const previews = filesToUpload.map((f) => ({
      src: URL.createObjectURL(f),
      id: f.name + f.lastModified,
      mediaType: f.type.split("/")[0],
      isUploading: true,
    }));

    setUploadingFiles(previews);

    try {
      const res = await uploadMedia(filesToUpload);
      queryClient.setQueryData(["media"], (old) => ({
        ...old,
        pages: [
          { ...old.pages[0], data: [...res.data, ...old.pages[0].data] },
          ...old.pages.slice(1),
        ],
      }));
      onSuccess?.(res.data);
    } finally {
      setUploadingFiles([]);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (!isPending) handleUpload(e.dataTransfer.files);
  };

  const handleDrag = (e, value) => {
    e.preventDefault();
    setDragging(value);
  };

  const handleClick = () => {
    if (!isPending) inputRef.current?.click();
  };

  const shapes = {
    auto: "",
    square:
      "aspect-square rounded-lg border border-dashed border-gray-300 bg-[#fdfdfd] hover:bg-[#fafafa] overflow-hidden",
    circle: "aspect-square rounded-full",
  };

  return (
    <div>
      <div
        className={cn(
          "relative border border-dashed border-gray-300 rounded-lg bg-[#fdfdfd] text-sm text-gray-600 transition-colors cursor-pointer hover:bg-[#fafafa] flex items-center justify-center flex-col",
          dragging && "bg-[#f7f7f7] border-solid border-foreground-primary",
          isPending && "cursor-default pointer-events-none",
          files?.length > 0 && !multi ? "" : "min-h-32",
          shapes[shape],
          className
        )}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
      >
        <div>
          <div className="pointer-events-none">
            {isPending && (
              <FiLoader className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin size-5" />
            )}

            {dragging && !isPending && (
              <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-medium text-foreground-secondary">
                Drop to upload
              </span>
            )}

            {(!files?.length > 0 || multi) && !isPending && !dragging && (
              <div className="flex flex-col items-center justify-center">
                <FiUpload />
                <span>Drop or click to browse</span>
              </div>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multi}
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />

          {showPreviews && files?.length > 0 && !multi && (
            <SingleMediaPreview
              className={imageClass}
              shape={shape}
              file={files[0]}
              onRemove={onRemove}
            />
          )}
        </div>
      </div>
      {showPreviews && files?.length > 0 && multi && (
        <MultiMediaPreview
          className={imageClass}
          files={files}
          onRemove={onRemove}
        />
      )}
    </div>
  );
}
