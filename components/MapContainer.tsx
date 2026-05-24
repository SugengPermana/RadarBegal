'use client';

import { useEffect, useState } from 'react';
import {
  APIProvider,
  Map,
  Circle,
  AdvancedMarker,
} from '@vis.gl/react-google-maps';

import { BeritaBegal } from '@/types/begal';

interface MapContainerProps {
  beritaList: BeritaBegal[];
  selectedBerita: BeritaBegal | null;
  onSelectBerita: (berita: BeritaBegal | null) => void;
  radiusMeter?: number; // optional radius override
}

export default function MapContainer({
  beritaList,
  selectedBerita,
  onSelectBerita,
  radiusMeter
}: MapContainerProps) {
  const [center, setCenter] = useState({ lat: -6.2088, lng: 106.8456 });
  const [zoom, setZoom] = useState(11);

  // Auto focus map to selected berita
  useEffect(() => {
    if (selectedBerita) {
      setCenter({ lat: selectedBerita.latitude, lng: selectedBerita.longitude });
      setZoom(35); // Zoom in closer
    }
  }, [selectedBerita]);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="w-full h-full">
        <Map
          center={center}
          zoom={zoom}
          onCenterChanged={ev => setCenter(ev.detail.center)}
          onZoomChanged={ev => setZoom(ev.detail.zoom)}
          mapId="begal-map"
          gestureHandling="greedy"
          disableDefaultUI={true}
        >
          {beritaList.map((berita) => (
            <div key={berita.id}>
              {/* Circle Area */}
              <Circle
                center={{
                  lat: berita.latitude,
                  lng: berita.longitude,
                }}
                radius={radiusMeter || berita.radius_meter || 300}
                strokeColor={selectedBerita?.id === berita.id ? "#0d9488" : "#ff0000"}
                strokeOpacity={0.8}
                strokeWeight={selectedBerita?.id === berita.id ? 3 : 2}
                fillColor={selectedBerita?.id === berita.id ? "#0d9488" : "#ff0000"}
                fillOpacity={0.3}
              />

              {/* Marker */}
              <AdvancedMarker
                position={{
                  lat: berita.latitude,
                  lng: berita.longitude,
                }}
                onClick={() => onSelectBerita(berita)}
                zIndex={selectedBerita?.id === berita.id ? 100 : 1}
              >
                <div className={`text-2xl transition-transform ${selectedBerita?.id === berita.id ? 'scale-125' : 'hover:scale-110'}`}>🚨</div>
              </AdvancedMarker>
            </div>
          ))}
        </Map>
      </div>
    </APIProvider>
  );
}