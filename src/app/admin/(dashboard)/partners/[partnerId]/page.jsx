import React from "react";

export default async function ProductDetailsPage({ params }) {
  const { partnerId } = await params;
  return <div>{partnerId}</div>;
}
