import React from "react";

export default async function ProductDetailsPage({ params }) {
  const { productId } = await params;
  return <div>{productId}</div>;
}
