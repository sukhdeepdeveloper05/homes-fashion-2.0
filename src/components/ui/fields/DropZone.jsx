"use client";

import { useState } from "react";
import Image from "next/image";
import { FiX, FiUpload, FiLoader } from "react-icons/fi";
import Button from "@/components/ui/Button";
import { useUploadMutation } from "@/hooks/queries";
import clsx from "clsx";
import { MEDIA_URL } from "@/config/Consts";

const ACCEPT_ALL = "image/*";

export default function DropZone({
  name,
  label = "Upload Image",
  labelClass = "",
  onChange,
  multi = false,
  max = 10,
  accept = ACCEPT_ALL,
  previews = true,
  shape = "square",
  shapeClass = "",
  initial = [],
  validate,
  className = "",
  imageClass = "",
  imageProps = {},
}) {
  const [files, setFiles] = useState(initial);

  const { mutateAsync: uploadMedia, isPending } = useUploadMutation();

  const handleSelect = async (e) => {
    const chosen = Array.from(e.target.files);
    if (!chosen.length) return;
    const valid = validate ? chosen.filter(validate) : chosen;
    const limit = multi ? valid.slice(0, max - files.length) : [valid[0]];
    try {
      if (limit.length) {
        const response = await uploadMedia(limit);
        console.log(response);

        const newUpdatedFiles = multi
          ? [...files, ...response.data]
          : response.data;

        setFiles(newUpdatedFiles);

        onChange?.(
          multi ? newUpdatedFiles.map((f) => f.id) : newUpdatedFiles[0].id
        );
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      e.target.value = "";
    }
  };

  const remove = (file) => {
    const leftFiles = multi ? files.filter((f) => f.id !== file.id) : null;
    setFiles(leftFiles ?? []);
    onChange?.(leftFiles?.map((f) => f.id) ?? null);
  };

  const shapeCls = shape === "circle" ? "rounded-full" : "rounded-lg";

  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      {label && (
        <label
          htmlFor={name}
          className={clsx("font-medium text-foreground-primary", labelClass)}
        >
          {label}
        </label>
      )}

      <div
        className={clsx(
          "relative flex items-center justify-center border border-dashed border-gray-300 bg-white cursor-pointer",
          multi ? "h-44" : "w-full h-44",
          shapeCls,
          shapeClass,
          {
            "h-auto aspect-square": !multi && files[0],
          },
          {
            "!border-0": shapeClass,
          }
        )}
      >
        {isPending ? (
          <FiLoader className="animate-spin text-2xl text-foreground-primary" />
        ) : !multi && files[0] ? (
          <>
            <Image
              src={`${MEDIA_URL}${files[0].src}`}
              alt="preview"
              fill
              sizes="500px"
              className={clsx("object-contain", shapeCls, imageClass)}
              {...imageProps}
            />
            <Button
              onClick={() => remove(files[0])}
              className="!absolute right-1.5 top-1.5 z-10 !h-5 !w-5 rounded-md p-0 border-0 bg-red-600"
              type="button"
            >
              <FiX className="text-xs" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-sm text-gray-600">
            <FiUpload />
            <span>Drop or click to browse</span>
          </div>
        )}

        <input
          type="file"
          id={name}
          name={name}
          accept={accept}
          multiple={multi}
          onChange={handleSelect}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />
      </div>

      {multi && previews && files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {files.map((f, i) => (
            <div key={i} className={`relative overflow-hidden ${shapeCls}`}>
              <Image
                src={`${MEDIA_URL}${f.src}`}
                alt={`img-${i}`}
                width={110}
                height={110}
                className={`border border-gray-200 aspect-square w-full object-contain ${shapeCls}`}
              />
              <Button
                onClick={() => remove(f)}
                className="!absolute right-1.5 top-1.5 !h-5 !w-5 rounded-md p-0 border-0 bg-red-600"
                type="button"
              >
                <FiX className="text-xs" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
