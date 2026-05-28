"use client";

import { useEffect, useRef, useState } from "react";
import {
  APIProvider,
  Map,
  Circle,
  AdvancedMarker,
  useMap,
} from "@vis.gl/react-google-maps";

import { BeritaBegal } from "@/types/begal";
import { riskColors } from "@/lib/risk";
import { distanceMeters } from "@/lib/geo";
import { MapNewsPopup } from "@/components/MapNewsPopup";
import { MapPlacePopup } from "@/components/MapPlacePopup";
import { supabase } from "@/lib/supabase/client";

interface MapContainerProps {
  beritaList: BeritaBegal[];
  selectedBerita: BeritaBegal | null;
  onSelectBerita: (berita: BeritaBegal | null) => void;
  userLocation?: { lat: number; lng: number } | null;
  poiMode?: "none" | "police" | "hospital";
  flyToTarget?: {
    lat: number;
    lng: number;
    zoom?: number;
    key?: number;
  } | null;
}

function MapFlyController({
  flyToTarget,
}: {
  flyToTarget?: {
    lat: number;
    lng: number;
    zoom?: number;
    key?: number;
  } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !flyToTarget) return;
    map.panTo({ lat: flyToTarget.lat, lng: flyToTarget.lng });
    map.setZoom(flyToTarget.zoom ?? 16);
  }, [
    map,
    flyToTarget?.lat,
    flyToTarget?.lng,
    flyToTarget?.zoom,
    flyToTarget?.key,
  ]);

  return null;
}

type PlaceMarker = {
  placeId: string;
  name: string;
  address?: string | null;
  rating?: number | null;
  openNow?: boolean | null;
  lat: number;
  lng: number;
};

function MapInner({
  beritaList,
  selectedBerita,
  onSelectBerita,
  userLocation,
  poiMode,
  flyToTarget,
}: MapContainerProps) {
  const map = useMap();

  const mode = poiMode ?? "none";
  const locationKey = userLocation
    ? `${userLocation.lat.toFixed(6)},${userLocation.lng.toFixed(6)}`
    : null;

  const [policePlaces, setPolicePlaces] = useState<PlaceMarker[]>([]);
  const [hospitalPlaces, setHospitalPlaces] = useState<PlaceMarker[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceMarker | null>(null);

  const placesFetchedKeyRef = useRef<string | null>(null);
  const lastFlyRef = useRef<string>("");
  const [placesLoading, setPlacesLoading] = useState(false);

  useEffect(() => {
    // Tutup popup & marker jika user membatalkan lokasi / keluar mode POI.
    setSelectedPlace(null);
  }, [mode, locationKey]);

  // Fetch dari Supabase emergency table
  useEffect(() => {
    if (!userLocation) return;
    if (mode === "none") return;
    if (!map) return;
    if (!locationKey) return;
    const fetchKey = `${mode}-${locationKey}`;

    if (placesFetchedKeyRef.current === fetchKey) return;

    let cancelled = false;
    placesFetchedKeyRef.current = fetchKey;
    setPlacesLoading(true);
    setPolicePlaces([]);
    setHospitalPlaces([]);

    (async () => {
      try {
        // Fetch both categories from Supabase
        const { data, error } = await supabase
          .from("emergency")
          .select("*")
          .eq("is_active", true);

        if (cancelled || error || !data) {
          if (!cancelled) setPlacesLoading(false);
          return;
        }

        const toMarker = (d: any): PlaceMarker => ({
          placeId: `emergency-${d.id}`,
          name: d.name,
          address: d.address,
          rating: null,
          openNow: null,
          lat: d.latitude,
          lng: d.longitude,
        });

        // Sort by distance and take closest 8
        const sortByDist = (items: any[]) =>
          items
            .map((d) => ({
              ...d,
              _dist: distanceMeters(
                userLocation.lat,
                userLocation.lng,
                d.latitude,
                d.longitude
              ),
            }))
            .sort((a, b) => a._dist - b._dist)
            .slice(0, 8);

        const policeData = sortByDist(
          data.filter((d) => d.category === "POLICE")
        ).map(toMarker);
        const hospitalData = sortByDist(
          data.filter((d) => d.category === "HOSPITAL")
        ).map(toMarker);

        if (!cancelled) {
          setPolicePlaces(policeData);
          setHospitalPlaces(hospitalData);
        }
      } catch {
        // ignore
      } finally {
        if (!cancelled) setPlacesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [map, userLocation?.lat, userLocation?.lng, locationKey, mode]);

  // Fly to nearest
  useEffect(() => {
    if (!userLocation) return;
    if (mode === "none") return;
    if (!map) return;

    const candidates = mode === "police" ? policePlaces : hospitalPlaces;
    if (!candidates.length) return;

    const nearest = candidates.reduce(
      (best, curr) => {
        const dCurr = distanceMeters(
          userLocation.lat,
          userLocation.lng,
          curr.lat,
          curr.lng
        );
        if (!best || dCurr < best.dist) return { place: curr, dist: dCurr };
        return best;
      },
      null as null | { place: PlaceMarker; dist: number }
    );

    if (!nearest?.place) return;
    const flyKey = `${mode}-${locationKey}-${nearest.place.placeId}`;
    if (lastFlyRef.current === flyKey) return;
    lastFlyRef.current = flyKey;

    map.panTo({ lat: nearest.place.lat, lng: nearest.place.lng });
    map.setZoom(15);
  }, [
    mode,
    policePlaces,
    hospitalPlaces,
    userLocation?.lat,
    userLocation?.lng,
    locationKey,
    map,
  ]);

  const handlePlaceClick = (place: PlaceMarker) => {
    setSelectedPlace(place);
  };

  const renderPlaceMarker = (
    place: PlaceMarker,
    kind: "police" | "hospital"
  ) => {
    const isSelected = selectedPlace?.placeId === place.placeId;
    const isPolice = kind === "police";

    return (
      <AdvancedMarker
        key={`${kind}-${place.placeId}`}
        position={{ lat: place.lat, lng: place.lng }}
        onClick={() => handlePlaceClick(place)}
        zIndex={isSelected ? 300 : 220}
      >
        <div className="relative flex items-center justify-center">
          <span
            className={`absolute w-8 h-8 rounded-full ${isPolice ? "bg-blue-500/25" : "bg-emerald-500/25"} animate-ping`}
          />
          <span
            className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
              isPolice ? "bg-blue-500" : "bg-emerald-500"
            }`}
          />
          {isSelected && (
            <MapPlacePopup
              place={{
                placeId: place.placeId,
                name: place.name,
                address: place.address,
                rating: place.rating ?? null,
                openNow: place.openNow ?? null,
              }}
              onClose={() => setSelectedPlace(null)}
            />
          )}
        </div>
      </AdvancedMarker>
    );
  };

  return (
    <>
      <MapFlyController flyToTarget={flyToTarget} />

      {beritaList.map((berita) => {
        const colors = riskColors(berita.tingkat_risiko);
        const isSelected = selectedBerita?.id === berita.id;

        return (
          <div key={berita.id}>
            <Circle
              center={{ lat: berita.latitude, lng: berita.longitude }}
              radius={berita.radius_meter}
              strokeColor={colors.stroke}
              strokeOpacity={isSelected ? 0.9 : 0.7}
              strokeWeight={isSelected ? 3 : 2}
              fillColor={colors.fill}
              fillOpacity={isSelected ? 0.25 : 0.15}
            />

            <AdvancedMarker
              position={{ lat: berita.latitude, lng: berita.longitude }}
              onClick={() => onSelectBerita(berita)}
              zIndex={isSelected ? 100 : 1}
            >
              <div className="relative flex items-center justify-center">
                <div
                  className={`text-2xl transition-transform drop-shadow-lg ${
                    isSelected ? "scale-125" : "hover:scale-110"
                  }`}
                >
                  🚨
                </div>
                {isSelected && (
                  <MapNewsPopup
                    berita={berita}
                    onClose={() => onSelectBerita(null)}
                  />
                )}
              </div>
            </AdvancedMarker>
          </div>
        );
      })}

      {userLocation && (
        <AdvancedMarker position={userLocation} zIndex={200}>
          <div className="relative flex items-center justify-center">
            <span className="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping" />
            <span className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg" />
          </div>
        </AdvancedMarker>
      )}

      {mode === "police" &&
        policePlaces.map((p) => renderPlaceMarker(p, "police"))}
      {mode === "hospital" &&
        hospitalPlaces.map((p) => renderPlaceMarker(p, "hospital"))}

      {placesLoading && mode !== "none" && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[240] bg-slate-900/70 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-300 backdrop-blur-md">
          Mencari tempat terdekat...
        </div>
      )}
    </>
  );
}

export default function MapContainer(props: MapContainerProps) {
  const defaultCenter = { lat: -6.2088, lng: 106.8456 };

  return (
    <APIProvider
      apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
      libraries={["places"]}
    >
      <div className="w-full h-full">
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={11}
          mapId="begal-map"
          gestureHandling="greedy"
          disableDefaultUI
          className="w-full h-full"
        >
          <MapInner {...props} />
        </Map>
      </div>
    </APIProvider>
  );
}
