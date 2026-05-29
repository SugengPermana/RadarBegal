/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

export type UserLocationState = {
  lat: number;
  lng: number;
  address: string;
  city: string;
};

type LocationContextType = {
  userLocation: UserLocationState | null;
  isLocating: boolean;
  locationError: string;
  setUserLocation: (loc: UserLocationState) => void;
  clearLocation: () => void;
  requestLocation: () => Promise<void>;
};

const LocationContext = createContext<LocationContextType>({
  userLocation: null,
  isLocating: false,
  locationError: "",
  setUserLocation: () => { },
  clearLocation: () => { },
  requestLocation: async () => { },
});

export const useLocation = () => useContext(LocationContext);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocationState] = useState<UserLocationState | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");

  const setUserLocation = useCallback((loc: UserLocationState) => {
    setUserLocationState(loc);
  }, []);

  const clearLocation = useCallback(() => {
    setUserLocationState(null);
    setLocationError("");
  }, []);

  const requestLocation = useCallback(async () => {
    setIsLocating(true);
    setLocationError("");

    if (!("geolocation" in navigator)) {
      setIsLocating(false);
      setLocationError("Geolokasi tidak didukung");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
          );

          const geo = await response.json();

          const city =
            geo.address?.city ||
            geo.address?.town ||
            geo.address?.municipality ||
            geo.address?.county;

          const district =
            geo.address?.suburb ||
            geo.address?.city_district ||
            geo.address?.village;

          const locationName =
            district && city
              ? `${district}, ${city}`
              : city || "Lokasi Anda";

          setUserLocationState({
            lat,
            lng,
            city: locationName,
            address: geo.display_name || locationName,
          });
        } catch (error) {
          console.error("Geocoding error:", error);

          setUserLocationState({
            lat,
            lng,
            city: "Lokasi Anda",
            address: "Lokasi Anda",
          });
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Location error:", error);
        setLocationError("Akses lokasi ditolak");
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  const value = useMemo(
    () => ({
      userLocation,
      isLocating,
      locationError,
      setUserLocation,
      clearLocation,
      requestLocation,
    }),
    [userLocation, isLocating, locationError, setUserLocation, clearLocation, requestLocation]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}


