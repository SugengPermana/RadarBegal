'use client';

import { useEffect } from 'react';
import {
  APIProvider,
  Map,
  Circle,
  AdvancedMarker,
  useMap,
} from '@vis.gl/react-google-maps';

import { BeritaBegal } from '@/types/begal';
import { riskColors } from '@/lib/risk';
import { MapNewsPopup } from '@/components/MapNewsPopup';

interface MapContainerProps {
  beritaList: BeritaBegal[];
  selectedBerita: BeritaBegal | null;
  onSelectBerita: (berita: BeritaBegal | null) => void;
  userLocation?: { lat: number; lng: number } | null;
  flyToTarget?: { lat: number; lng: number; zoom?: number; key?: number } | null;
}

function MapFlyController({
  flyToTarget,
}: {
  flyToTarget?: { lat: number; lng: number; zoom?: number; key?: number } | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!map || !flyToTarget) return;
    map.panTo({ lat: flyToTarget.lat, lng: flyToTarget.lng });
    map.setZoom(flyToTarget.zoom ?? 16);
  }, [map, flyToTarget?.lat, flyToTarget?.lng, flyToTarget?.zoom, flyToTarget?.key]);

  return null;
}

function MapInner({
  beritaList,
  selectedBerita,
  onSelectBerita,
  userLocation,
  flyToTarget,
}: MapContainerProps) {
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
                    isSelected ? 'scale-125' : 'hover:scale-110'
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
    </>
  );
}

export default function MapContainer(props: MapContainerProps) {
  const defaultCenter = { lat: -6.2088, lng: 106.8456 };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
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
