import Link from "next/link";
import React from "react";
import { BiChevronLeft } from "react-icons/bi";
import OrderDetailsContent from "./content";

export default async function OrderPage({ params }) {
  const { orderId } = await params;

  return (
    <div>
      <h4 className="flex items-center font-bold text-xl mb-5">
        <Link href="/admin/orders" className="mr-1">
          <BiChevronLeft fontSize={24} />
        </Link>
        Order Details
      </h4>

      <OrderDetailsContent orderId={orderId} />
    </div>
  );
}
