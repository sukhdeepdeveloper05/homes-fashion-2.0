"use client";
import { useState, useRef } from "react";
import { toast } from "sonner";

export default function useLocationSearch(
  setSearchTerm,
  moveMarkerTo,
  onLocationChange
) {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const searchTimerRef = useRef(null);

  const doSearch = async (query) => {
    if (!query) return setSearchResults([]);
    setLoading(true);
    try {
      const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
        query
      )}&api_key=${process.env.NEXT_PUBLIC_OLAMAPS_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      setSearchResults(
        data?.predictions || data?.results || data?.suggestions || []
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to search location");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => doSearch(query), 500);
  };

  const selectLocation = async (place) => {
    try {
      const placeId = place.place_id;
      if (!placeId) return toast.error("Selected place has no id");

      const detailsUrl = `https://api.olamaps.io/places/v1/details?place_id=${encodeURIComponent(
        placeId
      )}&api_key=${process.env.NEXT_PUBLIC_OLAMAPS_API_KEY}`;
      const res = await fetch(detailsUrl);
      const data = await res.json();
      const geometry = data?.result?.geometry;
      const formatted_address = data?.result?.formatted_address;

      if (!geometry) return toast.error("Could not get coordinates");

      const lng = geometry.location.lng || geometry.lng;
      const lat = geometry.location.lat || geometry.lat;

      moveMarkerTo(lng, lat);
      setSearchTerm("");
      setSearchResults([]);
      if (onLocationChange) onLocationChange(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch location details");
    }
  };

  return { searchResults, loading, handleSearch, selectLocation };
}
