import { MEDIA_URL } from "@/config/Consts";
import { cn } from "@/lib/utils";
import Button from "./Button";
import { FiX } from "react-icons/fi";
import Image from "next/image";

export function SingleMediaPreview({ className, shape, file, onRemove }) {
  let url = `${MEDIA_URL}${file.src}`;

  if (file instanceof File) {
    url = URL.createObjectURL(file);
  }

  const shapes = {
    square: "aspect-square rounded-lg",
    circle: "aspect-square rounded-full",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Image
        src={url}
        alt="preview"
        width={400}
        height={400}
        className={cn("w-full h-full object-contain", shapes[shape], className)}
      />
      <Button
        onClick={(e) => {
          e.stopPropagation();
          onRemove(file);
        }}
        className="!absolute right-1.5 top-1.5 z-10 !h-5 !w-5 rounded-md p-0 border-0 bg-red-600"
        type="button"
      >
        <FiX className="text-xs" />
      </Button>
    </div>
  );
}

export function MultiMediaPreview({ className, files, onRemove }) {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4">
      {files.map((f, i) => {
        let url = `${MEDIA_URL}${f.src}`;

        if (f instanceof File) {
          url = URL.createObjectURL(f);
        }
        return (
          <div
            key={url + i}
            className={`relative overflow-hidden rounded-md border border-gray-200`}
          >
            <Image
              src={url}
              alt={`img-${i}`}
              width={400}
              height={400}
              className={cn("aspect-square w-full object-contain", className)}
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(f);
              }}
              className="!absolute right-1.5 top-1.5 !h-5 !w-5 rounded-md p-0 border-0 bg-red-600"
              type="button"
            >
              <FiX className="text-xs" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
