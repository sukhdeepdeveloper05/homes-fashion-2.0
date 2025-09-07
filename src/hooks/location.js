"use client";

import { useEffect, useState } from "react";

const useUserLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const pickLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setLoading(false);
      return;
    }

    const successCallback = (position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setLoading(false);
    };

    const errorCallback = (err) => {
      setError(`Error (${err.code}): ${err.message}`);
      setLoading(false);
    };

    // Options for the geolocation request
    const options = {
      enableHighAccuracy: true, // Request more accurate results
      timeout: 5000, // Maximum time allowed to retrieve location
      maximumAge: 0, // Force fresh location data
    };

    navigator.geolocation.getCurrentPosition(
      successCallback,
      errorCallback,
      options
    );
  };

  return { location, pickLocation, error, loading };
};

export default useUserLocation;
