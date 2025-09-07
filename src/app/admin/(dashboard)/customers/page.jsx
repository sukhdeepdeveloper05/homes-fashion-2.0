import PageHeader from "@/components/admin/shared/PageHeader";
import CustomersContent from "./content";
import UpdateCustomer from "./updateCustomer";

export default async function CustomersPage({ searchParams }) {
  const rawParams = await searchParams;

  const normalizedParams = {
    page: Number(rawParams.page) || 1,
    perPage: Math.min(Number(rawParams.rawPerPage) || 10, 50),
    search: rawParams.search ?? null,
    sortKey: rawParams.sortKey ?? null,
    sortDir: rawParams.sortDir ?? null,
  };

  return (
    <>
      <div className="rounded-xl bg-white px-4 py-5 md:px-6">
        <PageHeader title="Customers" description="Manage your customers" />
        <CustomersContent searchParams={normalizedParams} />

        <UpdateCustomer />
      </div>
    </>
  );
}
