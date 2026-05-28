"use client";

import { useState, Suspense, useEffect, useCallback, useMemo } from "react";
import {
  MapPin,
  Filter,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import MapContainer from "@/components/MapContainer";
import { useBerita } from "@/providers/BeritaProvider";
import { useFilters } from "@/hooks/useFilters";
import { useNotifications } from "@/providers/NotificationProvider";
import { BeritaBegal } from "@/types/begal";
import { isInsideRadius } from "@/lib/geo";
import { areaWarningMessage, normalizeRiskLevel } from "@/lib/risk";
import { useLocation } from "@/providers/LocationProvider";

export default function Dashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center bg-slate-950">
          <div className="text-slate-500 animate-pulse">Loading...</div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

const RISK_PRIORITY: Record<string, number> = {
  CRITICAL: 3,
  WARNING: 2,
  CAUTION: 1,
};

function DashboardContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);
  const { userLocation, setUserLocation, clearLocation } = useLocation();
  const [poiMode, setPoiMode] = useState<"none" | "police" | "hospital">("none");
  const [flyToTarget, setFlyToTarget] = useState<{
    lat: number;
    lng: number;
    zoom?: number;
    key?: number;
  } | null>(null);
  const [areaWarning, setAreaWarning] = useState<{
    message: string;
    risk: string;
  } | null>(null);

  const { beritaData, isLoading } = useBerita();
  const { filters, setFilter, applyFilters } = useFilters();
  const { focusNewsId, setFocusNewsId } = useNotifications();

  const filteredBerita = applyFilters(beritaData);
  const selectedBerita =
    beritaData.find((b) => b.id.toString() === filters.id) || null;

  const flyToBerita = useCallback((berita: BeritaBegal) => {
    setFlyToTarget({
      lat: berita.latitude,
      lng: berita.longitude,
      zoom: 16,
      key: Date.now(),
    });
  }, []);

  const handleSelectBerita = useCallback(
    (berita: BeritaBegal | null) => {
      if (berita) {
        setFilter("id", berita.id.toString());
        flyToBerita(berita);
        setIsSidebarOpen(false);
      } else {
        setFilter("id", "");
      }
    },
    [setFilter, flyToBerita]
  );

  useEffect(() => {
    if (!focusNewsId) return;
    const berita = beritaData.find((b) => b.id === focusNewsId);
    if (berita) {
      handleSelectBerita(berita);
    }
    setFocusNewsId(null);
  }, [focusNewsId, beritaData, handleSelectBerita, setFocusNewsId]);

  useEffect(() => {
    if (!filters.id) return;
    const berita = beritaData.find((b) => b.id.toString() === filters.id);
    if (berita) {
      flyToBerita(berita);
      setIsSidebarOpen(false);
    }
  }, [filters.id, beritaData, flyToBerita]);

  useEffect(() => {
    if (!userLocation) {
      setAreaWarning(null);
      return;
    }

    const insideZones = beritaData.filter((b) =>
      isInsideRadius(
        userLocation.lat,
        userLocation.lng,
        b.latitude,
        b.longitude,
        b.radius_meter
      )
    );

    if (insideZones.length === 0) {
      setAreaWarning(null);
      return;
    }

    const highest = insideZones.reduce((prev, curr) => {
      const prevP = RISK_PRIORITY[normalizeRiskLevel(prev.tingkat_risiko)] ?? 0;
      const currP = RISK_PRIORITY[normalizeRiskLevel(curr.tingkat_risiko)] ?? 0;
      return currP > prevP ? curr : prev;
    });

    setAreaWarning({
      message: areaWarningMessage(highest.tingkat_risiko),
      risk: normalizeRiskLevel(highest.tingkat_risiko),
    });
  }, [userLocation, beritaData]);

  const handleGetLocation = () => {
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
        setPoiMode("none");

        // Reverse geocode (Google) untuk kebutuhan "Lokasi Anda: ..."
        const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
        let address = `Lokasi Anda: ${loc.lat.toFixed(5)}, ${loc.lng.toFixed(5)}`;
        try {
          if (googleKey) {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${loc.lat},${loc.lng}&key=${googleKey}&language=id`
            );
            const json = await res.json();
            const formatted = json?.results?.[0]?.formatted_address;
            if (formatted) address = formatted;
          }
        } catch {
          // fallback: lat,lng
        }

        setUserLocation({ ...loc, address });
        setFlyToTarget({ ...loc, zoom: 15, key: Date.now() });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
        setLocationError("Akses lokasi ditolak");
      },
      { enableHighAccuracy: true }
    );
  };

  const warningBannerClass = useMemo(() => {
    if (!areaWarning) return "";
    switch (areaWarning.risk) {
      case "CRITICAL":
        return "border-red-500/50 bg-red-950/90 text-red-100";
      case "WARNING":
        return "border-orange-500/50 bg-orange-950/90 text-orange-100";
      default:
        return "border-yellow-500/50 bg-yellow-950/90 text-yellow-100";
    }
  }, [areaWarning]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
      <button
        suppressHydrationWarning
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`absolute z-40 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 p-2.5 rounded-l-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 hover:text-teal-400 hover:bg-slate-800 ${
          isSidebarOpen
            ? "right-0 lg:right-[400px] xl:right-[450px]"
            : "right-0"
        }`}
      >
        {isSidebarOpen ? (
          <ChevronRight className="w-5 h-5 text-slate-400" />
        ) : (
          <ChevronLeft className="w-5 h-5 text-teal-500" />
        )}
      </button>

      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 hidden lg:flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-full px-6 py-3 shadow-lg">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500" />
        </span>
        <p className="font-semibold text-slate-200">
          Laporan Berita:{" "}
          <span className="font-bold text-teal-400">{filteredBerita.length}</span>
        </p>
      </div>

      {areaWarning && (
        <div
          className={`absolute top-20 md:top-24 left-4 right-4 md:left-8 md:right-auto md:max-w-lg z-30 p-4 rounded-2xl border backdrop-blur-xl shadow-2xl flex gap-3 ${warningBannerClass}`}
        >
          <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold uppercase tracking-wider mb-1 opacity-80">
              Peringatan Area — {areaWarning.risk}
            </p>
            <p className="text-sm leading-relaxed">{areaWarning.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setAreaWarning(null)}
            className="shrink-0 p-1 rounded-full hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="absolute inset-0 z-0 bg-slate-950 border-t border-slate-800 md:border-none">
        <MapContainer
          beritaList={filteredBerita}
          selectedBerita={selectedBerita}
          onSelectBerita={handleSelectBerita}
          userLocation={userLocation}
          poiMode={poiMode}
          flyToTarget={flyToTarget}
        />
      </div>

      <div
        className={`absolute bottom-0 right-0 z-40 bg-slate-950/95 backdrop-blur-3xl border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-[60vh] lg:h-full w-full lg:w-[400px] xl:w-[450px] transition-transform duration-500 ease-in-out ${
          isSidebarOpen
            ? "translate-y-0 lg:translate-x-0"
            : "translate-y-full lg:translate-y-0 lg:translate-x-full"
        }`}
      >
        <div className="w-full lg:w-[400px] xl:w-[450px] h-full flex flex-col min-w-[320px]">
          <div className="border-b border-slate-800 bg-slate-900/40 flex flex-col shrink min-h-0">
            <div
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-800/50 transition-colors shrink-0"
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
            >
              <h2 className="font-semibold text-base text-slate-100 flex items-center gap-2">
                <Filter className="w-4 h-4 text-red-500" />
                Filter Pantauan
              </h2>
              <button
                suppressHydrationWarning
                className="text-slate-400 hover:text-teal-400 transition-colors"
              >
                {isFilterPanelOpen ? (
                  <ChevronRight className="w-5 h-5 rotate-90 transition-transform" />
                ) : (
                  <ChevronRight className="w-5 h-5 transition-transform" />
                )}
              </button>
            </div>

            <div
              className={`flex flex-col gap-4 overflow-y-auto custom-scrollbar transition-all duration-300 ${
                isFilterPanelOpen
                  ? "max-h-[60vh] p-4 pt-0 opacity-100"
                  : "max-h-0 p-0 opacity-0 overflow-hidden"
              }`}
            >
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-slate-500 mb-1.5 uppercase">
                    Rentang Waktu
                  </label>
                  <select
                    value={filters.rentang}
                    onChange={(e) => setFilter("rentang", e.target.value)}
                    suppressHydrationWarning
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-xs"
                  >
                    <option>Semua</option>
                    <option>Hari Ini</option>
                    <option>7 Hari Terakhir</option>
                    <option>30 Hari Terakhir</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-slate-500 mb-1.5 uppercase">
                    Tingkat Risiko
                  </label>
                  <select
                    value={filters.risiko}
                    onChange={(e) => setFilter("risiko", e.target.value)}
                    suppressHydrationWarning
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-xs"
                  >
                    <option>Semua</option>
                    <option>CRITICAL</option>
                    <option>WARNING</option>
                    <option>CAUTION</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold tracking-wider text-slate-500 mb-1.5 uppercase">
                    Status Verifikasi
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilter("status", e.target.value)}
                    suppressHydrationWarning
                    className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-xs"
                  >
                    <option>Semua</option>
                    <option>Terverifikasi</option>
                    <option>Belum Terverifikasi</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <button
                  suppressHydrationWarning
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-slate-800/50 hover:bg-slate-800 text-slate-200 rounded-lg border border-slate-700 transition-colors text-xs font-semibold disabled:opacity-50"
                >
                  <MapPin
                    className={`w-3 h-3 ${isLocating ? "animate-bounce" : ""}`}
                  />
                  {isLocating ? "Mencari..." : "Lokasi Saya"}
                </button>
                {locationError && (
                  <p className="text-[10px] text-red-500 mt-2 text-center">
                    {locationError}
                  </p>
                )}

                {userLocation && (
                  <div className="mt-3">
                    <div className="text-[11px] text-slate-300 truncate">
                      Lokasi Anda: {userLocation.address}
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-2">
                      <button
                        type="button"
                        onClick={() => setPoiMode("hospital")}
                        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold border transition-colors ${
                          poiMode === "hospital"
                            ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                            : "bg-slate-800/40 border-slate-700 hover:bg-slate-800"
                        }`}
                      >
                        Rumah Sakit Terdekat
                      </button>

                      <button
                        type="button"
                        onClick={() => setPoiMode("police")}
                        className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-semibold border transition-colors ${
                          poiMode === "police"
                            ? "bg-blue-500/15 border-blue-500/30 text-blue-200"
                            : "bg-slate-800/40 border-slate-700 hover:bg-slate-800"
                        }`}
                      >
                        Kantor Polisi Terdekat
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        clearLocation();
                        setPoiMode("none");
                        setFlyToTarget(null);
                        setAreaWarning(null);
                      }}
                      className="mt-3 w-full flex items-center justify-center py-2 px-4 rounded-lg text-xs font-semibold bg-slate-900/40 border border-slate-800 hover:bg-slate-900 transition-colors"
                    >
                      Batalkan Lokasi Saya
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 pb-2">
              <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                </span>
                Live Laporan Berita
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {isLoading ? (
                [...Array(4)].map((_, idx) => (
                  <div
                    key={`skeleton-${idx}`}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-4 animate-pulse"
                  >
                    <div className="h-4 w-3/4 bg-slate-800 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-slate-800 rounded" />
                  </div>
                ))
              ) : filteredBerita.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">
                  Belum ada laporan sesuai filter
                </p>
              ) : (
                filteredBerita.map((feed) => (
                  <div
                    key={feed.id}
                    className={`bg-slate-900 border ${
                      selectedBerita?.id === feed.id
                        ? "border-yellow-500"
                        : "border-slate-800"
                    } rounded-2xl p-4 hover:border-slate-700 transition-colors cursor-pointer group`}
                    onClick={() => handleSelectBerita(feed)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border ${
                          normalizeRiskLevel(feed.tingkat_risiko) === "CRITICAL"
                            ? "bg-red-500/10 text-red-500 border-red-500/20"
                            : normalizeRiskLevel(feed.tingkat_risiko) === "WARNING"
                              ? "bg-orange-500/10 text-orange-400 border-orange-500/20"
                              : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        }`}
                      >
                        {feed.kategori}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        <Clock className="w-3 h-3" />
                        {new Date(feed.created_at).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    <h4 className="font-bold text-slate-200 text-sm mb-1 group-hover:text-teal-400 transition-colors truncate">
                      {feed.judul}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {feed.lokasi}
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-800/50 pt-3">
                      <div
                        className={`flex items-center gap-1.5 text-xs font-semibold ${
                          feed.status_verifikasi === "Terverifikasi"
                            ? "text-teal-500"
                            : "text-amber-500"
                        }`}
                      >
                        {feed.status_verifikasi === "Terverifikasi" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5" />
                        )}
                        {feed.status_verifikasi}
                      </div>
                      <span className="text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                        Detail &rarr;
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
