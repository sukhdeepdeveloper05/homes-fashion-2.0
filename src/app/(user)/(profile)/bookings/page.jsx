"use client";

import { SkeletonBox } from "@/components/ui/Skeletons";
import { useListQuery } from "@/hooks/queries";
import React from "react";

export default function BookingsPage() {
  const { data: { bookings } = {}, isLoading } = useListQuery({
    handle: "bookings",
    url: "/bookings",
    params: { sortBy: "createdAt", sortOrder: "desc" },
    queryKey: ["user-bookings"],
    requiresAuth: true,
  });

  function renderLoading() {
    return (
      <ul className="space-y-4">
        {[1, 2, 3].map((item) => (
          <li
            key={item}
            className="h-[102px] w-full bg-white border rounded-lg"
          >
            <SkeletonBox className="h-full w-full" />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-6 max-sm:text-center">
        My Bookings
      </h1>

      {isLoading ? renderLoading() : null}
      {!isLoading && bookings?.length === 0 ? <p>No bookings found.</p> : null}

      {bookings?.length > 0 && !isLoading && (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="font-semibold text-lg">
                {booking.orderItem.product.title}
              </p>
              <p className="text-sm text-gray-500">
                Date: {new Date(booking.bookedAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium">{booking.status}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
