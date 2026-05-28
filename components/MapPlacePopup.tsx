"use client";

import Link from "next/link";
import { Clock, Star, X } from "lucide-react";

type PlacePopup = {
  placeId: string;
  name: string;
  address?: string | null;
  rating?: number | null;
  openNow?: boolean | null;
};

export function MapPlacePopup({
  place,
  onClose,
}: {
  place: PlacePopup;
  onClose: () => void;
}) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    place.name
  )}&query_place_id=${encodeURIComponent(place.placeId)}`;

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bottom-6 w-[min(320px,calc(100vw-2rem))] pointer-events-auto z-[250]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 shadow-2xl">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Tempat Terdekat
            </p>
            <h4 className="font-bold text-sm text-slate-100 truncate">
              {place.name}
            </h4>
            {place.address && (
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {place.address}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 p-1 rounded-full hover:bg-white/10 text-slate-400 hover:text-slate-200"
            aria-label="Tutup popup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-2 flex items-center gap-3">
          {typeof place.rating === "number" && place.rating > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300">
              <Star className="w-3.5 h-3.5 text-amber-400" />
              {place.rating.toFixed(1)}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Star className="w-3.5 h-3.5" />
              -
            </span>
          )}

          {typeof place.openNow === "boolean" ? (
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              {place.openNow ? "Buka" : "Tutup"}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-slate-500">
              <Clock className="w-3.5 h-3.5" />
              Status tidak tersedia
            </span>
          )}
        </div>

        <div className="mt-3">
          <Link
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="block w-full bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-2.5 rounded-xl transition-colors text-center"
          >
            Navigasi Google Maps
          </Link>
        </div>
      </div>
    </div>
  );
}

