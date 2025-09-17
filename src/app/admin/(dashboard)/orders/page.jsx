import OrdersContent from "./content";
import PageHeader from "@/components/admin/shared/PageHeader";

export default async function OrdersPage({ searchParams }) {
  const rawParams = await searchParams;

  const normalizedParams = {
    page: Number(rawParams.page) || 1,
    perPage: Math.min(Number(rawParams.perPage) || 10, 50),
    search: rawParams.search ?? null,
    sortBy: rawParams.sortBy ?? "updatedAt",
    sortDir: rawParams.sortDir ?? "desc",
    orderStatus: rawParams.orderStatus ?? null,
    paymentStatus: rawParams.paymentStatus ?? null,
  };

  return (
    <>
      <div className="rounded-xl bg-white px-4 py-5 md:px-6">
        <PageHeader title="Orders" description="Manage your orders" />

        <OrdersContent searchParams={normalizedParams} />
      </div>
    </>
  );
}
