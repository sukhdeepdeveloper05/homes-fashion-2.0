"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { MdLocationPin } from "react-icons/md";
import { color } from "motion";

export default function AddressStep({ onLocationPick }) {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null); // the returned "map" object
  const olaInstanceRef = useRef(null); // the OlaMaps instance (new OlaMaps(...))
  const olaModuleRef = useRef(null); // the imported module (for inspecting available exports)
  const markerRef = useRef(null); // will hold whatever marker handle we create
  const searchTimerRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- Initialize OlaMa ---
  useEffect(() => {
    let isMounted = true;

    if (!mapContainerRef.current) return;

    (async () => {
      try {
        const module = await import("olamaps-web-sdk");
        const { OlaMaps } = module;

        if (!OlaMaps) {
          console.error("OlaMaps SDK not found in module:", module);
          return;
        }

        olaModuleRef.current = OlaMaps;
        const olaInstance = new OlaMaps({
          apiKey: process.env.NEXT_PUBLIC_OLAMAPS_API_KEY,
        });
        olaInstanceRef.current = olaInstance;

        let map = olaInstance.init({
          style: `https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json?api_key=${process.env.NEXT_PUBLIC_OLAMAPS_API_KEY}`,
          container: mapContainerRef.current,
          center: [77.61648476788898, 12.931423492103944],
          zoom: 15,
        });

        if (map instanceof Promise) map = await map;

        if (isMounted) {
          mapRef.current = map;

          // 🔹 Add initial draggable marker
          markerRef.current = olaInstance
            .addMarker({ color: "red", draggable: true })
            .setLngLat([77.61648476788898, 12.931423492103944])
            .addTo(map);

          // 🔹 Handle drag end
          markerRef.current.on("dragend", () => {
            const lngLat = markerRef.current.getLngLat();
            console.log("Marker dragged to:", lngLat);

            if (onLocationPick) {
              onLocationPick(lngLat);
            }
          });

          // 🔹 Handle map click → move marker
          map.on("click", (e) => {
            const { lng, lat } = e.lngLat;

            console.log("Marker dragged to:", e.lngLat.lng);

            if (markerRef.current) {
              markerRef.current.setLngLat([lng, lat]);
            } else {
              markerRef.current = olaInstance
                .addMarker({ color: "red", draggable: true })
                .setLngLat([lng, lat])
                .addTo(map);

              markerRef.current.on("dragend", () => {
                const pos = markerRef.current.getLngLat();
                if (onLocationPick) onLocationPick(pos);
              });
            }

            if (onLocationPick) {
              onLocationPick({ lng, lat });
            }
          });
        }
      } catch (err) {
        console.error("Failed to initialize OlaMaps:", err);
      }
    })();

    return () => {
      isMounted = false;
      try {
        mapRef.current?.remove?.();
        olaInstanceRef.current?.destroy?.();
      } catch {}
    };
  }, []);

  // --- Debounced search (no external libs) ---
  const doSearch = async (query) => {
    if (!query) return setSearchResults([]);
    setLoading(true);
    try {
      const url = `https://api.olamaps.io/places/v1/autocomplete?input=${encodeURIComponent(
        query
      )}&api_key=${process.env.NEXT_PUBLIC_OLAMAPS_API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      // SDKs differ in structure: try common keys
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

  const onInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };

  // --- select place (autocomplete -> details) ---
  const selectLocation = async (place) => {
    try {
      const placeId = place.place_id;
      if (!placeId) return toast.error("Selected place has no id");

      const detailsUrl = `https://api.olamaps.io/places/v1/details?place_id=${encodeURIComponent(
        placeId
      )}&api_key=${process.env.NEXT_PUBLIC_OLAMAPS_API_KEY}`;
      const res = await fetch(detailsUrl);
      const data = await res.json();
      const result = data?.result;
      const geometry = result?.geometry;
      const formatted_address = result?.formatted_address;

      if (!geometry)
        return toast.error("Could not get coordinates for this place");

      const lng = geometry.location.lng || geometry.lng;
      const lat = geometry.location.lat || geometry.lat;

      // Move map
      await moveMapTo(lng, lat);

      // Move marker (if exists) or create one
      if (markerRef.current) {
        markerRef.current.setLngLat([lng, lat]);
      }

      // Update input and search results
      setSearchTerm(formatted_address || place.description || "");
      setSearchResults([]);

      if (onLocationPick) onLocationPick({ lng, lat });
      toast.success("Location selected");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch location details");
    }
  };

  const moveMapTo = async (lng, lat) => {
    const map = mapRef.current;
    try {
      if (!map) return;
      // try map.setView([lng,lat], zoom)
      if (typeof map.setView === "function") return map.setView([lng, lat], 16);
      // try map.flyTo or map.panTo
      if (typeof map.flyTo === "function")
        return map.flyTo({ center: [lng, lat], zoom: 16 });
      if (typeof map.panTo === "function") return map.panTo([lng, lat]);
      // try map.setCenter (Mapbox-like)
      if (typeof map.setCenter === "function") return map.setCenter([lng, lat]);
      // if none exists, no-op
    } catch (e) {
      console.warn("moveMapTo fallback failed", e);
    }
  };

  // --- cleanup timer ---
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, []);

  return (
    <div className="relative w-full h-[400px]">
      {/* Floating Search Box */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-md z-20">
        <input
          type="text"
          value={searchTerm}
          onChange={onInputChange}
          placeholder="Search your location..."
          className="border rounded-lg px-4 py-2 w-full shadow bg-white"
        />

        {loading && (
          <p className="text-sm text-gray-500 bg-white p-2 rounded-md shadow">
            Searching...
          </p>
        )}

        {searchResults.length > 0 && (
          <div className="border rounded-lg mt-1 bg-white shadow max-h-60 overflow-y-auto">
            {searchResults.map((res, idx) => (
              <div
                key={res.place_id ?? res.id ?? idx}
                onClick={() => selectLocation(res)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {res.structured_formatting.main_text}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map container */}
      <div className="relative w-full h-full">
        <div
          ref={mapContainerRef}
          className="w-full h-full border rounded-lg"
        />
      </div>
    </div>
  );
}
