"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function useOlaMap({
  mapContainerRef,
  onLocationChange,
  defaultCoordinates: { lat: defaultLat, lng: defaultLng },
}) {
  const mapRef = useRef(null);
  const olaInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const geolocateRef = useRef(null);
  const activeRequestRef = useRef(null);

  const fetchPlace = async (lng, lat) => {
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }

    activeRequestRef.current = new AbortController();

    try {
      const res = await fetch(
        `https://api.olamaps.io/places/v1/reverse-geocode?latlng=${lat},${lng}&api_key=${process.env.NEXT_PUBLIC_OLAMAPS_API_KEY}`,
        { signal: activeRequestRef.current.signal }
      );
      return await res.json();
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Reverse geocode failed:", err);
      }
    }
  };

  useEffect(() => {
    let isMounted = true;
    if (!mapContainerRef.current) return;

    (async () => {
      try {
        const olaInstance = new window.OlaMaps({
          apiKey: process.env.NEXT_PUBLIC_OLAMAPS_API_KEY,
        });
        olaInstanceRef.current = olaInstance;

        let map = olaInstance.init({
          style:
            "https://api.olamaps.io/styleEditor/v1/styleEdit/styles/2a1a672a-a4cc-43f4-bbeb-5feb452becc4/my-styles",
          container: mapContainerRef.current,
          center: [defaultLng, defaultLat],
          zoom: 16,
        });

        if (map instanceof Promise) {
          map = await map;
        }

        if (!isMounted) return;
        mapRef.current = map;

        const address = await fetchPlace(defaultLng, defaultLat);
        if (address) onLocationChange(address);

        // Add draggable marker
        markerRef.current = olaInstance
          .addMarker({ color: "red", draggable: true })
          .setLngLat([defaultLng, defaultLat])
          .addTo(map);

        // Drag marker -> get updated place object
        markerRef.current.on("dragend", async () => {
          const lngLat = markerRef.current.getLngLat();
          const address = await fetchPlace(lngLat.lng, lngLat.lat);
          if (address) onLocationChange(address);
        });

        // Map click -> move marker & fetch place
        map.on("click", async (e) => {
          const { lng, lat } = e.lngLat;
          markerRef.current.setLngLat([lng, lat]);
          const address = await fetchPlace(lng, lat);
          onLocationChange(address);
        });

        if (!geolocateRef.current) {
          const geolocate = olaInstance.addGeolocateControls({
            positionOptions: {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            },
            trackUserLocation: false,
          });

          map.addControl(geolocate);

          geolocateRef.current = geolocate;

          geolocate.on("geolocate", async (pos) => {
            const { latitude, longitude } = pos.coords;
            moveMarkerTo(longitude, latitude);
            const address = await fetchPlace(longitude, latitude);
            onLocationChange(address);
          });

          geolocate.on("error", () => {
            toast.error("Could not get your location");
          });
        }
      } catch (err) {
        console.error("Failed to initialize OlaMaps:", err);
      }
    })();

    return () => {
      isMounted = false;
      try {
        markerRef.current?.off("dragend");
        mapRef.current?.off("click");
        geolocateRef.current?.off("geolocate");
        geolocateRef.current?.off("error");
      } catch {}
    };
  }, [mapContainerRef, defaultLat, defaultLng, onLocationChange]);

  const moveMarkerTo = async (lng, lat) => {
    const map = mapRef.current;
    if (!map) return;

    markerRef.current?.setLngLat([lng, lat]);

    if (typeof map.flyTo === "function") {
      return map.flyTo({ center: [lng, lat], zoom: 16 });
    }
    if (typeof map.panTo === "function") {
      return map.panTo([lng, lat]);
    }
    if (typeof map.setCenter === "function") {
      return map.setCenter([lng, lat]);
    }
  };

  return {
    mapRef,
    mapContainerRef,
    markerRef,
    moveMarkerTo,
    geolocate: () => geolocateRef.current?.trigger?.(),
  };
}
