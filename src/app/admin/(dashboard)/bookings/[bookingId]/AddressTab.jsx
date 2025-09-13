import React from "react";

export default function AddressTab({ address }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium space-x-2">
        <span className="font-semibold">Saved as:</span>
        <span>{address?.label}</span>
      </p>
      <p className="font-medium space-x-2">
        <span className="font-semibold">House/Flat No:</span>
        <span>{address?.houseNumber}</span>
      </p>
      <p className="font-medium space-x-2">
        <span className="font-semibold">Landmark:</span>
        <span>
          {address?.landmark.trim() === "" ? "--" : address?.landmark}
        </span>
      </p>
      <p className="font-medium space-x-2">
        <span className="font-semibold">Short Address:</span>
        <span>{address?.name}</span>
      </p>
      <p className="font-medium space-x-2">
        <span className="font-semibold">Full Address:</span>
        <span>{address?.formattedAddress}</span>
      </p>
    </div>
  );
}
