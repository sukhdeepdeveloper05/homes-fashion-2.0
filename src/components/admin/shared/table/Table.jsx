"use client";

import { useState } from "react";
import {
  Table as ShadcnTable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/shadcn/table";
import { FiMail, FiMapPin, FiLock, FiDownload } from "react-icons/fi";
import { LuPhone } from "react-icons/lu";
import SelectField from "@/components/ui/fields/SelectField";
import StatusSelectField from "@/components/ui/fields/StatusSelectField";
import formatDate from "@/utils/formatDate";
import formatTime from "@/utils/formatTime";
import clsx from "clsx";
import Image from "next/image";

import { TableSkeleton } from "../../../ui/Skeletons";
import ActionsCell from "./ActionCell";
import { MEDIA_URL } from "@/config/Consts";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { cn } from "@/lib/utils";

export default function Table({
  headings = [],
  rows = [],
  isLoading = true,
  sortBy,
  sortDir,
  onSort,
  skeletonRows = 10,
  emptyClass = "",
}) {
  const [localSort, setLocalSort] = useState({ key: sortBy, dir: sortDir });

  const handleSort = (key) => {
    const dir =
      localSort.key === key
        ? localSort.dir === "asc"
          ? "desc"
          : "asc"
        : localSort.dir || "asc";
    setLocalSort({ key, dir });
    onSort?.(key, dir);
  };

  const renderCell = (row, col, columnKey) => {
    const cellValue = col?.render?.(row) ?? row[columnKey];
    const renderer = cellRenderers[col.type];

    if (renderer) return renderer(row, col, columnKey, cellValue);

    // default fallback
    return (
      <span
        className={clsx("line-clamp-1 text-ellipsis", {
          capitalize: col.capitalize,
          "truncate max-w-xs": col.truncate,
        })}
        title={cellValue}
      >
        {String(cellValue)}
      </span>
    );
  };

  return (
    <div className="w-full overflow-auto mt-6">
      <ShadcnTable className="">
        <TableHeader>
          <TableRow className={"border-none bg-gray-100"}>
            {headings.map((h) => (
              <TableHead
                key={h.key}
                onClick={() => h.sortable && handleSort(h.key)}
                className={cn(
                  "whitespace-nowrap px-4 py-5 text-sm font-bold text-gray-600 transition-colors last-of-type:text-right first:rounded-l-lg last:rounded-r-lg group/tr",
                  h.sortable && "cursor-pointer hover:text-gray-500",
                  h?.columnClass
                )}
              >
                <p className="flex items-center group-last-of-type/tr:justify-end">
                  <span>{h.title}</span>
                  {h.sortable && (
                    <span
                      className="ml-2 opacity-0 group-hover/tr:opacity-100 data-[active=true]:opacity-100 transition-opacity duration-200 ease-in-out"
                      data-active={localSort.key === h.key}
                    >
                      {localSort.dir === "desc" ? (
                        <IoIosArrowUp />
                      ) : (
                        <IoIosArrowDown />
                      )}
                    </span>
                  )}
                </p>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableSkeleton rows={skeletonRows} colSpan={headings.length} />
          ) : rows.length > 0 ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                className="not-last:border-b border-gray-200"
              >
                {headings.map((col) => (
                  <TableCell
                    key={`${col.key}-${row.id}`}
                    className="px-4 py-3.5"
                  >
                    {renderCell(row, col, col.key)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow className={clsx(emptyClass)}>
              <TableCell
                colSpan={headings.length}
                className="text-center py-10"
              >
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ShadcnTable>
    </div>
  );
}

const cellRenderers = {
  text: (row, col, columnKey, cellValue) => {
    if (["title", "name"].includes(columnKey)) {
      return (
        <div className="flex items-center gap-2">
          <span className="flex-shrink-0 rounded-md overflow-hidden bg-foreground-secondary flex items-center justify-center uppercase text-xl font-bold text-white size-10">
            {row?.featuredImage || row?.avatar ? (
              <Image
                src={`${MEDIA_URL}${row.featuredImage?.src || row.avatar.src}`}
                alt=""
                width={100}
                height={100}
                className="size-full object-cover"
              />
            ) : (
              cellValue?.[0]
            )}
          </span>
          <span
            className={clsx("line-clamp-1 text-ellipsis", {
              capitalize: col.capitalize,
              "truncate max-w-xs": col.truncate,
            })}
          >
            {cellValue}
          </span>
        </div>
      );
    }

    const iconMap = {
      email: <FiMail className="text-gray-500" />,
      phone: <LuPhone className="text-gray-500" />,
      map: <FiMapPin className="text-gray-500" />,
      lock: <FiLock className="text-gray-500" />,
      download: <FiDownload className="text-gray-500" />,
    };

    return (
      <div className="flex items-center gap-1.5">
        {col.icon && <span className="text-base">{iconMap[col.icon]}</span>}
        <span
          className={clsx("line-clamp-1 text-ellipsis", {
            capitalize: col.capitalize,
            "truncate max-w-xs": col.truncate,
          })}
        >
          {cellValue}
        </span>
      </div>
    );
  },

  status: (row, col, _, cellValue) => (
    <StatusSelectField
      key={row.id}
      id={row.id}
      options={col?.options}
      value={cellValue}
      size="xs"
      onChange={async (val) => {
        if (typeof col?.onChange !== "function") return;
        await col?.onChange(row.id, val);
      }}
      hideOptions={col?.hideOptions}
      dropdownClass="w-full"
    />
  ),

  select: (_, col, __, cellValue) => (
    <SelectField options={col?.options} value={cellValue} size="xs" />
  ),

  date: (_, col, __, cellValue) => (
    <span className="flex items-center gap-2">
      <span>{col.showTime && formatTime(cellValue)}</span>
      <span>{formatDate(cellValue)}</span>
    </span>
  ),

  actions: (row, col) => <ActionsCell row={row} actions={col.actions} />,
};
