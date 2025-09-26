import { useEffect, useRef, useState } from "react";
import DropZone from "../DropZone";
import { cn } from "@/lib/utils";
import MediaPickerModal from "@/components/admin/ui/modals/Media";
import { MultiMediaPreview, SingleMediaPreview } from "../MediaPreview";

export default function MediaField({
  name,
  label = "Upload Image",
  labelClass = "",
  onChange,
  multi = false,
  max = 20,
  accept = "image/*",
  previews = true,
  shape = "auto",
  shapeClass = "",
  imageClass = "",
  initial = [],
  className = "",
  createMedia = false,
  showModal = true,
}) {
  const [files, setFiles] = useState(initial);
  const [isOpen, setIsOpen] = useState(false);

  const shapes = {
    auto: "rounded-lg",
    square: "aspect-square rounded-lg",
    circle: "aspect-square rounded-full",
  };

  async function handleFilesChange(newUpdatedFiles) {
    try {
      if (!newUpdatedFiles.length) {
        await onChange?.(null);
        setFiles(newUpdatedFiles);
      }

      const hasFileObjects = newUpdatedFiles.some((f) => f instanceof File);
      const value = multi
        ? hasFileObjects
          ? newUpdatedFiles
          : newUpdatedFiles.map((f) => f.id)
        : hasFileObjects
        ? newUpdatedFiles[0]
        : newUpdatedFiles[0].id;

      await onChange?.(value);
      setFiles(newUpdatedFiles);
    } catch (error) {
      console.log(error);
    }
  }

  const removeFile = (file) => {
    if (file instanceof File) {
      handleFilesChange(
        files.filter((f) => f.lastModified !== file.lastModified)
      );
    } else {
      handleFilesChange(files.filter((f) => f.id !== file.id));
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {label && (
        <label
          htmlFor={name}
          onClick={() => setIsOpen(true)}
          className={cn("font-medium text-foreground-primary", labelClass)}
        >
          {label}
        </label>
      )}

      {showModal ? (
        <div
          className={cn(
            "relative text-sm text-gray-600 cursor-pointer flex items-center justify-center flex-col border border-dashed border-gray-300 bg-[#fdfdfd] hover:bg-[#fafafa]",
            files.length > 0 && !multi ? "" : "min-h-32",
            shapes[shape],
            shapeClass
          )}
          onClick={() => setIsOpen(true)}
        >
          <div>
            {files?.length > 0 && !multi ? (
              <SingleMediaPreview
                className={imageClass}
                shape={shape}
                file={files[0]}
                onRemove={removeFile}
              />
            ) : (
              <div className="flex flex-col items-center">
                <span>Pick an existing file</span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <DropZone
          accept={accept}
          onSuccess={handleFilesChange}
          setUploadingFiles={() => {}}
          files={files}
          multi={multi}
          max={max}
          onRemove={removeFile}
          showPreviews={previews}
          creatMedia={createMedia}
          className={shapeClass}
          imageClass={imageClass}
          shape={shape}
        />
      )}

      {multi && files?.length > 0 && showModal && (
        <MultiMediaPreview
          className={imageClass}
          files={files}
          onRemove={removeFile}
        />
      )}

      {showModal && (
        <MediaPickerModal
          open={isOpen}
          onClose={(v, selected) => {
            setIsOpen(v);
            if (selected) handleFilesChange(selected);
          }}
          accept={accept}
          files={files}
          multi={multi}
          max={max}
        />
      )}
    </div>
  );
}
