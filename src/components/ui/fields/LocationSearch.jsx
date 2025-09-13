"use client";

import useLocationSearch from "@/hooks/location/locationSearch";
import { useState } from "react";

export default function LocationSearch({ moveMarkerTo, onLocationChange }) {
  const [searchTerm, setSearchTerm] = useState("");

  // console.log(searchTerm);

  const { searchResults, loading, handleSearch, selectLocation } =
    useLocationSearch(setSearchTerm, moveMarkerTo, onLocationChange);

  const onInputChange = (e) => {
    const value = e.target.value;
    if (value.trim() === "") {
      setSearchTerm("");
      return;
    }
    setSearchTerm(value);
    handleSearch(value);
  };

  return (
    <div className="w-full relative">
      <input
        type="text"
        value={searchTerm}
        onChange={onInputChange}
        placeholder="Search your location..."
        className="w-full border p-3 rounded-md"
      />

      {(loading || searchResults.length > 0) && (
        <div className="absolute left-0 right-0 mt-1 border rounded-lg bg-white shadow max-h-60 overflow-y-auto z-50">
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
          )}

          {searchResults.map((res, idx) => (
            <div
              key={res.place_id ?? res.id ?? idx}
              onClick={() => selectLocation(res)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex flex-col"
            >
              <span className="text-sm font-semibold">
                {res.structured_formatting.main_text}
              </span>
              <span className="text-xs text-muted-foreground">
                {res.structured_formatting.secondary_text}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
