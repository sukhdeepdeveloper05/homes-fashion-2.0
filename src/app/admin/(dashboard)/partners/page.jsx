import PageHeader from "@/components/admin/shared/PageHeader";
import PartnersContent from "./content";
import AddNewPartner from "./AddNewPartner";

export default async function PartnersPage({ searchParams }) {
  const rawParams = await searchParams;

  const normalizedParams = {
    page: Number(rawParams.page) || 1,
    perPage: Math.min(Number(rawParams.perPage) || 10, 50),
    search: rawParams.search ?? null,
    sortBy: rawParams.sortBy ?? "updatedAt",
    sortDir: rawParams.sortDir ?? "desc",
  };

  return (
    <>
      <div className="rounded-xl bg-white px-4 py-5 md:px-6">
        <PageHeader
          title="Partners"
          description="Manage your partners"
          buttons={[{ identifier: "add", label: "Add Partner" }]}
        />

        <PartnersContent searchParams={normalizedParams} />

        <AddNewPartner />
      </div>
    </>
  );
}
