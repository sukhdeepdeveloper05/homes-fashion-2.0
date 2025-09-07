"use client";

import clsx from "clsx";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/shadcn/pagination";
import SelectField from "@/components/ui/fields/SelectField";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { motion } from "framer-motion";

export default function TablePagination({
  totalRecords = 0,
  currentPage = 1,
  perPage = 10,
  onPerPageChange,
  showPerPage = false,
  perPageOptions = [5, 10, 25, 50],
  isLoading = false,
  className = "",
}) {
  const [totalPages, setTotalPages] = useState(1);
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  useEffect(() => {
    if (!isLoading) {
      setTotalPages(Math.max(1, Math.ceil(totalRecords / perPage)));
    }
  }, [isLoading, totalRecords, perPage]);

  // helper to generate page numbers with ellipsis
  const getPages = (maxVisible = 5) => {
    if (totalPages <= maxVisible)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const side = Math.floor((maxVisible - 3) / 2);

    if (currentPage <= side + 2) {
      return [
        ...Array.from({ length: maxVisible - 1 }, (_, i) => i + 1),
        "ellipsis-next",
        totalPages,
      ];
    }

    if (currentPage >= totalPages - (side + 1)) {
      return [
        1,
        "ellipsis-prev",
        ...Array.from(
          { length: maxVisible - 1 },
          (_, i) => totalPages - (maxVisible - 2) + i
        ),
      ];
    }

    return [
      1,
      "ellipsis-prev",
      ...[currentPage - 1, currentPage, currentPage + 1],
      "ellipsis-next",
      totalPages,
    ];
  };

  // Animated Ellipsis Component
  const AnimatedEllipsis = ({ direction }) => {
    return (
      <PaginationLink
        href={{
          pathname: "",
          query: {
            ...query,
            page:
              direction === "prev"
                ? Math.max(1, currentPage - 2)
                : Math.min(totalPages, currentPage + 2),
          },
        }}
        className="group relative px-2 flex"
      >
        <span className="transition-opacity duration-200 ease-in-out text-gray-500 group-hover:hidden">
          <MoreHorizontalIcon className="size-4" />
        </span>
        <span className="absolute inset-0 items-center justify-center transition-opacity duration-200 ease-in-out text-gray-700 font-semibold hidden group-hover:flex">
          {direction === "prev" ? (
            <ChevronsLeftIcon className="size-4" />
          ) : (
            <ChevronsRightIcon className="size-4" />
          )}
        </span>
      </PaginationLink>
    );
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-between border-t border-gray-200 pt-5",
        className
      )}
    >
      <Pagination>
        <PaginationContent className="relative flex items-center">
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              href={{
                pathname: "",
                query: {
                  ...query,
                  page: currentPage - 1,
                },
              }}
              className={clsx(
                currentPage - 1 === 0 &&
                  "pointer-events-none text-muted-foreground"
              )}
            />
          </PaginationItem>

          {/* Pages with sliding highlight */}
          {getPages().map((p, i) => (
            <PaginationItem key={i} className="relative">
              {p === "ellipsis-prev" || p === "ellipsis-next" ? (
                <AnimatedEllipsis
                  direction={p === "ellipsis-prev" ? "prev" : "next"}
                />
              ) : (
                <PaginationLink
                  href={{
                    pathname: "",
                    query: { ...query, page: p },
                  }}
                  isActive={p === currentPage}
                  className="relative px-3 py-1"
                >
                  {p === currentPage && (
                    <motion.div
                      layoutId="pagination-highlight"
                      className="absolute inset-0 rounded-md bg-gray-100"
                      transition={{
                        type: "spring",
                        stiffness: 800,
                        damping: 50,
                      }}
                    />
                  )}
                  <span className="relative z-10">{p}</span>
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          {/* Next */}
          <PaginationItem>
            <PaginationNext
              href={{
                pathname: "",
                query: { ...query, page: currentPage + 1 },
              }}
              className={clsx(
                currentPage >= totalPages &&
                  "pointer-events-none text-muted-foreground"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {/* Per-page select */}
      {showPerPage && (
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-600">
            {`Showing ${(currentPage - 1) * perPage + 1}–${Math.min(
              currentPage * perPage,
              totalRecords
            )} of ${totalRecords}`}
          </span>
          <div className="w-28 h-full">
            <SelectField
              anchor="top"
              options={perPageOptions.map((v) => ({ value: v, label: v }))}
              value={perPage}
              size="xs"
              onChange={(v) => onPerPageChange?.(Number(v))}
              buttonClass="py-2 px-3"
            />
          </div>
        </div>
      )}
    </div>
  );
}
