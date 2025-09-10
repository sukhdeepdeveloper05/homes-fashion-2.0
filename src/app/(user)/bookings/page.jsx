import { getData } from "@/lib/api";
import React from "react";

export default async function BookingsPage() {
  const { data: bookings } = await getData("/bookings", {}, true);

  console.log(bookings)

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings?.length ? (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <p className="font-semibold text-lg">{booking.orderItem.product.title}</p>
              <p className="text-sm text-gray-500">
                Date: {new Date(booking.bookedAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">
                Status: <span className="font-medium">{booking.status}</span>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No bookings found.</p>
      )}
    </div>
  );
}
