"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn/card";
import { MEDIA_URL } from "@/config/Consts";
import { use } from "react";
import { useDetailsQuery } from "@/hooks/queries";
import { TabsContent } from "@/components/shadcn/tabs";
import CustomTabs from "@/components/ui/Tabs";
import formatDate from "@/utils/formatDate";
import CustomerTab from "./CustomerTab";
import AddressTab from "./AddressTab";
import OrderTab from "./OrderTab";
import PartnerTab from "./PartnerTab";

const TABS = [
  { name: "Customer", slug: "customer" },
  { name: "Address", slug: "address" },
  { name: "Order", slug: "order" },
  { name: "Partner", slug: "partner" },
];

export default function BookingDetails({ params }) {
  const { bookingId } = use(params);

  const { data: { details = {} } = {}, isLoading } = useDetailsQuery({
    handle: "booking",
    url: "/bookings",
    queryKey: ["bookingDetails", bookingId],
    params: { id: bookingId },
    requiresAuth: true,
  });

  console.log(details);

  const {
    customer,
    partner,
    address,
    orderItem,
    status,
    scheduledAt,
    bookedAt,
  } = details;

  return (
    <div className="rounded-xl bg-white px-4 py-5 md:px-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold">Booking Details</h1>

      {/* Tabs */}
      <div className="mt-6">
        <CustomTabs tabs={TABS}>
          <TabsContent value="customer">
            <CustomerTab customer={customer} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="address">
            <AddressTab address={address} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="order">
            <OrderTab orderItem={orderItem} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="partner">
            <PartnerTab partner={partner} isLoading={isLoading} />
          </TabsContent>
        </CustomTabs>
      </div>
    </div>
  );
}
