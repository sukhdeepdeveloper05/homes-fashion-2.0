"use client";

import { useListQuery } from "@/hooks/queries";
import { FiSearch } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { MEDIA_URL } from "@/config/Consts";
import { formatPrice } from "@/utils/formatPrice";
import { PiImage } from "react-icons/pi";

export default function ServiceSearch() {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const inputRef = useRef(null);

  // Debounce
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: { services = [] } = {}, isLoading } = useListQuery({
    queryKey: ["services", debounced],
    handle: "services",
    url: "/products",
    requiresAuth: false,
    params: { search: debounced },
    queryOptions: { enabled: debounced.trim() !== "" },
  });

  // track input position for absolute portal placement
  useEffect(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [inputRef.current]);

  return (
    <>
      <div
        className="flex items-center gap-2 rounded-lg px-4 py-3 bg-white w-full"
        ref={inputRef}
      >
        <FiSearch className="text-xl text-foreground-tertiary min-w-5" />
        <input
          type="text"
          placeholder="Find your service"
          className="text-foreground-primary w-full h-7 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Dropdown in portal */}
      {search &&
        inputRef.current &&
        createPortal(
          <>
            <div className="fixed inset-0 z-40" onClick={() => setSearch("")} />
            ,
            <div
              style={{
                position: "absolute",
                top: dropdownPos.top,
                left: dropdownPos.left,
                width: dropdownPos.width,
                zIndex: 9999,
              }}
              className="rounded-lg overflow-hidden mt-1 border bg-white"
            >
              <div className=" shadow max-h-60 overflow-y-auto py-2">
                {isLoading && search.trim() !== "" && (
                  <div className="px-4 py-2 text-sm text-gray-500">
                    Searching...
                  </div>
                )}

                {services.map((service) => {
                  const url = `/collections/${service.collections?.[0]?.id}#${service.id}`;
                  return (
                    <Link
                      key={service.id}
                      href={url}
                      className="px-4 py-2 cursor-pointer flex items-center gap-4"
                    >
                      <div className="relative aspect-square w-22 overflow-hidden rounded-lg">
                        {service?.featuredImage?.src ? (
                          <Image
                            src={MEDIA_URL + service.featuredImage.src}
                            alt=""
                            width={120}
                            height={100}
                            className="w-full object-cover object-top h-full absolute inset-0"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full bg-gray-300">
                            <PiImage className="size-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold">{service.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {service.collections[0]?.title}
                        </span>
                        <span className="text-xs font-medium">
                          <span>Starts at </span>
                          <span>{formatPrice(service.price)}</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}

                {!isLoading &&
                  services.length === 0 &&
                  debounced.trim() !== "" && (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No results found
                    </div>
                  )}
              </div>
            </div>
          </>,
          document.body
        )}
    </>
  );
}
