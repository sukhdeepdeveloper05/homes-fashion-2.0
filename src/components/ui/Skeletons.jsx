import { TableCell, TableRow } from "@/components/shadcn/table";
import { cn } from "@/lib/utils";

export function SkeletonBox({ className }) {
  return (
    <div className={cn("bg-gray-200 animate-pulse rounded-md", className)} />
  );
}

export function TableSkeleton({ rows = 10, className = "", colSpan = 5 }) {
  return Array.from({ length: rows }, (_, i) => (
    <TableRow key={`skeleton-${i}`}>
      <TableCell colSpan={colSpan} className="px-0 py-3.5 group/td">
        <div
          className={cn(
            "h-10 w-full bg-gray-300 animate-pulse rounded-md",
            className
          )}
        />
      </TableCell>
    </TableRow>
  ));
}

export function CardSkeleton({
  avatarLines = 8,
  className = "",
  cardHeight = "h-[25rem]",
}) {
  return (
    <div
      className={cn(
        "flex min-w-80 lg:w-[19rem] rounded-lg bg-gradient-to-r from-gray-150 to-gray-300",
        cardHeight
      )}
    >
      <div className="w-full p-4 md:p-6 rounded shadow border border-gray-300">
        <div className="flex items-center justify-center h-48 mb-4">
          <svg
            className="h-32 w-32 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
          </svg>
        </div>
        {Array.from({ length: avatarLines }).map((_, i) => (
          <div
            key={i}
            className={cn("mb-2.5 h-2 rounded-full bg-gray-300", {
              "mb-0": i === avatarLines - 1,
            })}
          />
        ))}
      </div>
    </div>
  );
}

export function DetailsSkeleton({ className = "", cardHeight = "h-[25rem]" }) {
  return (
    <div role="status" className={cn("flex", className)}>
      <div className={cn("flex w-full rounded-lg", cardHeight)}>
        <div className="w-full p-4 md:p-6 rounded shadow bg-gradient-to-r from-gray-150 to-gray-300">
          <div className="mb-3 h-12 rounded bg-gray-300" />
          <div className="mb-3 h-56 rounded bg-gray-300" />
          <div className="h-12 rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
