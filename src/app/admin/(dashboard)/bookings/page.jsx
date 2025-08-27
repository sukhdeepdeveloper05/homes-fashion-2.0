import BookingsContent from "./content";
import PageHeader from "@/components/shared/PageHeader";

export default async function BookingsPage({ searchParams }) {
  const rawParams = await searchParams;

  const normalizedParams = {
    page: Number(rawParams.page) || 1,
    perPage: Math.min(Number(rawParams.rawPerPage) || 10, 50),
    search: rawParams.search ?? null,
    sortKey: rawParams.sortKey ?? null,
    sortDir: rawParams.sortDir ?? null,
    bookingStatus: rawParams.bookingStatus ?? null,
  };

  return (
    <>
      <div className="rounded-xl bg-white px-4 py-5 md:px-6">
        <PageHeader title="Bookings" description="Manage your bookings" />

        <BookingsContent searchParams={normalizedParams} />
      </div>
    </>
  );
}
