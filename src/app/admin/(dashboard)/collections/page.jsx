import PageHeader from "@/components/admin/shared/PageHeader";
import CollectionsContent from "./content";
import AddNewCollection from "./AddNewCollection";

export default async function CollectionsPage({ searchParams }) {
  const rawParams = await searchParams;

  const normalizedParams = {
    page: Number(rawParams.page) || 1,
    perPage: Math.min(Number(rawParams.perPage) || 10, 50),
    search: rawParams.search ?? null,
    sortKey: rawParams.sortKey ?? null,
    sortDir: rawParams.sortDir ?? null,
  };

  return (
    <>
      <div className="rounded-xl bg-white px-4 py-5 md:px-6">
        <PageHeader
          title="Collections"
          description="Manage your collections"
          buttons={[{ identifier: "add", label: "Add Collection" }]}
        />

        <CollectionsContent searchParams={normalizedParams} />

        <AddNewCollection />
      </div>
    </>
  );
}
