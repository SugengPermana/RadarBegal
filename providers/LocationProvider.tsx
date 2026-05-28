/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { createContext, useContext, useMemo, useState, useCallback } from "react";

export type UserLocationState = {
  lat: number;
  lng: number;
  address: string;
};

type LocationContextType = {
  userLocation: UserLocationState | null;
  setUserLocation: (loc: UserLocationState) => void;
  clearLocation: () => void;
};

const LocationContext = createContext<LocationContextType>({
  userLocation: null,
  setUserLocation: () => {},
  clearLocation: () => {},
});

export const useLocation = () => useContext(LocationContext);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [userLocation, setUserLocationState] = useState<UserLocationState | null>(null);

  const setUserLocation = useCallback((loc: UserLocationState) => {
    setUserLocationState(loc);
  }, []);

  const clearLocation = useCallback(() => {
    setUserLocationState(null);
  }, []);

  const value = useMemo(
    () => ({
      userLocation,
      setUserLocation,
      clearLocation,
    }),
    [userLocation, setUserLocation, clearLocation]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

