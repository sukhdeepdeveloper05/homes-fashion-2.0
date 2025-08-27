import PageHeader from "@/components/shared/PageHeader";
import ProductsContent from "./content";
import AddNewProduct from "./AddNewProduct";

export default async function ProductsPage({ searchParams }) {
  const rawParams = await searchParams;

  const normalizedParams = {
    page: Number(rawParams.page) || 1,
    perPage: Math.min(Number(rawParams.perPage) || 10, 50),
    search: rawParams.search ?? null,
    sortKey: rawParams.sortKey ?? null,
    sortDir: rawParams.sortDir ?? null,
    status: rawParams.status ?? null,
    collectionId: rawParams.collectionId ?? null,
    available: rawParams.available ?? null,
  };

  return (
    <div className="rounded-xl bg-white px-4 py-5 md:px-6">
      <PageHeader
        title="Products"
        description="Manage your products"
        buttons={[{ identifier: "add", label: "Add Product" }]}
      />

      <ProductsContent searchParams={normalizedParams} />

      <AddNewProduct />
    </div>
  );
}
