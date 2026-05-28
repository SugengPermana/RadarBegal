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

function MapInner({
  beritaList,
  selectedBerita,
  onSelectBerita,
  userLocation,
  poiMode,
  flyToTarget,
}: MapContainerProps) {
  const map = useMap();

  type PlaceMarker = {
    placeId: string;
    name: string;
    address?: string | null;
    rating?: number | null;
    openNow?: boolean | null;
    lat: number;
    lng: number;
  };

  const mode = poiMode ?? "none";
  const locationKey = userLocation
    ? `${userLocation.lat.toFixed(6)},${userLocation.lng.toFixed(6)}`
    : null;

  const [policePlaces, setPolicePlaces] = useState<PlaceMarker[]>([]);
  const [hospitalPlaces, setHospitalPlaces] = useState<PlaceMarker[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceMarker | null>(null);

  const placesFetchedKeyRef = useRef<string | null>(null);
  const detailsCacheRef = useRef<Record<string, PlaceMarker>>({});
  const lastFlyRef = useRef<string>("");
  const [placesLoading, setPlacesLoading] = useState(false);

  useEffect(() => {
    // Tutup popup & marker jika user membatalkan lokasi / keluar mode POI.
    setSelectedPlace(null);
  }, [mode, locationKey]);

  useEffect(() => {
    if (!userLocation) return;
    if (mode === "none") return;
    if (!map) return;
    if (!locationKey) return;
    const fetchKey = `${mode}-${locationKey}`;

    if (placesFetchedKeyRef.current === fetchKey) return;

    const googleObj = (window as any)?.google;
    const PlacesService = googleObj?.maps?.places?.PlacesService;
    if (!PlacesService || !map) return;

    let cancelled = false;
    placesFetchedKeyRef.current = fetchKey;
    setPlacesLoading(true);
    setPolicePlaces([]);
    setHospitalPlaces([]);

    const service = new PlacesService(map);

    const nearbySearch = (type: "police" | "hospital") =>
      new Promise<PlaceMarker[]>((resolve) => {
        service.nearbySearch(
          {
            location: { lat: userLocation.lat, lng: userLocation.lng },
            radius: type === "police" ? 10000 : 5000,
            type: type,
            keyword: type === "police" ? "kantor polisi" : "rumah sakit",
          } as any,
          (results: any[], status: string) => {
            if (cancelled) return;
            if (status !== "OK" || !results) return resolve([]);

            const mapped = results
              .map((r: any) => {
                const g = r?.geometry?.location;
                const lat =
                  typeof g?.lat === "function"
                    ? g.lat()
                    : (g?.lat as number | undefined);
                const lng =
                  typeof g?.lng === "function"
                    ? g.lng()
                    : (g?.lng as number | undefined);

                if (!lat || !lng) return null;

                return {
                  placeId: r.place_id,
                  name: r.name,
                  address: r.vicinity || r.formatted_address || null,
                  rating: r.rating ?? null,
                  openNow: r?.opening_hours?.open_now ?? null,
                  lat,
                  lng,
                } satisfies PlaceMarker;
              })
              .filter(Boolean) as PlaceMarker[];

            // Ambil secukupnya biar marker tidak berlebihan.
            resolve(mapped.slice(0, 8));
          },
        );
      });

    (async () => {
      try {
        const [pol, hos] = await Promise.all([
          nearbySearch("police"),
          nearbySearch("hospital"),
        ]);
        if (cancelled) return;
        setPolicePlaces(pol);
        setHospitalPlaces(hos);
      } catch {
        // ignore, handled by empty arrays
      } finally {
        if (!cancelled) setPlacesLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [map, userLocation?.lat, userLocation?.lng, locationKey, mode]);

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
          curr.lng,
        );
        if (!best || dCurr < best.dist) return { place: curr, dist: dCurr };
        return best;
      },
      null as null | { place: PlaceMarker; dist: number },
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

  const handlePlaceClick = async (place: PlaceMarker) => {
    setSelectedPlace(place);

    if (detailsCacheRef.current[place.placeId]) {
      setSelectedPlace(detailsCacheRef.current[place.placeId]);
      return;
    }

    // Jika opening status sudah ada, tidak perlu request lagi.
    if (typeof place.openNow === "boolean") {
      detailsCacheRef.current[place.placeId] = place;
      return;
    }

    const googleObj = (window as any)?.google;
    const PlacesService = googleObj?.maps?.places?.PlacesService;
    if (!PlacesService || !map) return;

    let cancelled = false;
    const service = new PlacesService(map);

    try {
      const detailed = await new Promise<PlaceMarker | null>((resolve) => {
        service.getDetails(
          {
            placeId: place.placeId,
            fields: [
              "place_id",
              "name",
              "formatted_address",
              "rating",
              "opening_hours",
              "geometry",
            ],
          } as any,
          (res: any, status: string) => {
            if (cancelled) return resolve(null);
            if (status !== "OK" || !res) return resolve(null);

            const g = res?.geometry?.location;
            const lat =
              typeof g?.lat === "function"
                ? g.lat()
                : (g?.lat as number | undefined);
            const lng =
              typeof g?.lng === "function"
                ? g.lng()
                : (g?.lng as number | undefined);

            const opened = res?.opening_hours?.open_now;

            resolve({
              placeId: res.place_id,
              name: res.name,
              address: res.formatted_address || res.vicinity || null,
              rating: res.rating ?? null,
              openNow: typeof opened === "boolean" ? opened : null,
              lat: lat ?? place.lat,
              lng: lng ?? place.lng,
            });
          },
        );
      });

      if (!detailed) return;
      detailsCacheRef.current[place.placeId] = detailed;
      setSelectedPlace(detailed);
    } finally {
      // best-effort cleanup flag
      cancelled = true;
    }
  };

  const renderPlaceMarker = (
    place: PlaceMarker,
    kind: "police" | "hospital",
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
