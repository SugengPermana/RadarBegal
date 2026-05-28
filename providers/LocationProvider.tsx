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
  setUserLocation: () => {},
  clearLocation: () => {},
  requestLocation: async () => {},
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
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        let address = `Lokasi Anda: ${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;
        let city = "Lokasi Tidak Diketahui";

        try {
          if (googleKey) {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat},${loc.lng}&key=${googleKey}&language=id`
            );
            const json = await res.json();
            
            if (json?.results && json.results.length > 0) {
              const formatted = json.results[0].formatted_address;
              if (formatted) address = formatted;

              // Find city (locality or admin_area_level_2)
              for (const result of json.results) {
                for (const component of result.address_components) {
                  if (component.types.includes("administrative_area_level_2") || component.types.includes("locality")) {
                    city = component.long_name;
                    break;
                  }
                }
                if (city !== "Lokasi Tidak Diketahui") break;
              }
            }
          }
        } catch {
          // fallback
        }

        setUserLocationState({ ...loc, address, city });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setLocationError("Akses lokasi ditolak");
      },
      { enableHighAccuracy: true }
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

