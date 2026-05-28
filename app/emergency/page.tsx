"use client";

import Link from "next/link";
import {
  Siren,
  Hospital,
  Search,
  Phone,
  Map,
  FileWarning,
  Loader2,
  MapPin,
  Building2
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { ReportForm } from "@/components/ReportForm";
import { useState, useEffect } from "react";
import { useLocation } from "@/providers/LocationProvider";
import { supabase } from "@/lib/supabase/client";

export default function EmergencyPage() {
  const { user, isLoading } = useAuth();
  const [showReportForm, setShowReportForm] = useState(false);
  const { userLocation, isLocating, requestLocation, clearLocation } = useLocation();
  const [facilities, setFacilities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchFacilities() {
      if (!userLocation) {
        setFacilities([]);
        return;
      }

      const { data, error } = await supabase
        .from("emergency")
        .select("*")
        .eq("is_active", true);

      console.log("USER LOCATION:", userLocation);
      console.log("FACILITY DATA:", data);
      console.log("ERROR:", error);

      if (!error && data) {
        // Calculate naive distance for sorting
        const withDistance = data.map((d) => {
          const dx = d.latitude - userLocation.lat;
          const dy = d.longitude - userLocation.lng;
          return { ...d, distance: Math.sqrt(dx * dx + dy * dy) };
        });

        withDistance.sort((a, b) => a.distance - b.distance);

        // Get nearest police and hospital
        const police = withDistance.find(d => d.category === 'POLICE');
        const hospital = withDistance.find(d => d.category === 'HOSPITAL');

        const nearest = [];
        if (police) nearest.push(police);
        if (hospital) nearest.push(hospital);

        setFacilities(nearest);
      }
    }
    fetchFacilities();
  }, [userLocation]);

  const handleLocationToggle = async () => {
    if (userLocation) {
      clearLocation();
    } else {
      await requestLocation();
    }
  };

  const locationText = userLocation ? userLocation.city || "Lokasi Anda" : "Lokasi Tidak Diketahui";
  const facilityCount = userLocation ? facilities.length : 0;

  return (
    <div className="flex-1 p-4 md:p-8 max-w-[1200px] mx-auto w-full flex flex-col pt-20 md:pt-8 bg-slate-950 relative z-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-100 tracking-tight">
          Emergency Call
        </h1>
        <button
          type="button"
          onClick={() => setShowReportForm(!showReportForm)}
          className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold px-6 py-3 rounded-xl transition-colors shadow-[0_0_20px_rgba(13,148,136,0.3)]"
        >
          <FileWarning className="w-5 h-5" />
          Lapor Kejadian
        </button>
      </div>

      {showReportForm && (
        <div className="mb-10 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
          <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <FileWarning className="w-5 h-5 text-teal-500" />
            Form Laporan Kejadian
          </h2>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
            </div>
          ) : !user ? (
            <div className="text-center py-8">
              <p className="text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl py-4 px-6 mb-6">
                Anda harus login terlebih dahulu untuk membuat laporan.
              </p>
              <Link
                href="/login?redirect=/emergency"
                className="inline-block bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 py-3 rounded-xl transition-colors"
              >
                Login Sekarang
              </Link>
            </div>
          ) : (
            <ReportForm />
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full">
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6 w-full">
          {/* BANNER 110 & 118 */}
          <div className="flex flex-col gap-4">
            <a
              href="tel:110"
              className="group bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all duration-300 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between relative overflow-hidden w-full"
            >
              <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto mb-4 sm:mb-0">
                <div className="bg-slate-950 border border-slate-800 text-teal-400 p-4 rounded-2xl group-hover:bg-teal-500 group-hover:text-slate-900 transition-colors shrink-0">
                  <Siren className="w-8 h-8" />
                </div>
                <div>
                  <span className="font-bold tracking-wider text-[10px] sm:text-xs text-slate-400 uppercase mb-1 block">
                    Bantuan Polisi Segera
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-slate-100 group-hover:text-teal-400 transition-colors tracking-tight">
                    110
                  </div>
                </div>
              </div>
              <div className="relative z-10 hidden sm:block">
                <div className="bg-slate-950 text-slate-400 font-bold text-sm px-6 py-3 rounded-full border border-slate-800 group-hover:bg-teal-500/10 group-hover:text-teal-400 transition-colors">
                  Hubungi Polisi &rarr;
                </div>
              </div>
            </a>

            <a
              href="tel:118"
              className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all duration-300 rounded-3xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between relative overflow-hidden w-full"
            >
              <div className="flex items-center gap-4 relative z-10 w-full sm:w-auto mb-4 sm:mb-0">
                <div className="bg-slate-950 border border-slate-800 text-amber-500 p-4 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors shrink-0">
                  <Hospital className="w-8 h-8" />
                </div>
                <div>
                  <span className="font-bold tracking-wider text-[10px] sm:text-xs text-slate-400 uppercase mb-1 block">
                    Darurat Medis
                  </span>
                  <div className="text-4xl sm:text-5xl font-black text-slate-100 group-hover:text-amber-500 transition-colors tracking-tight">
                    118
                  </div>
                </div>
              </div>
              <div className="relative z-10 hidden sm:block">
                <div className="bg-slate-950 text-slate-400 font-bold text-sm px-6 py-3 rounded-full border border-slate-800 group-hover:bg-amber-500/10 group-hover:text-amber-400 transition-colors">
                  Panggil Ambulans &rarr;
                </div>
              </div>
            </a>
          </div>

          <div className="mt-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                Cari Layanan Darurat Terdekat
              </h2>
              <button
                type="button"
                onClick={handleLocationToggle}
                disabled={isLocating}
                className={`flex items-center justify-center gap-2 font-bold px-6 py-3 rounded-xl transition-colors border w-full sm:w-auto ${userLocation
                  ? "bg-slate-800/50 hover:bg-slate-800 text-slate-300 border-slate-700"
                  : "bg-teal-600 hover:bg-teal-500 text-white border-teal-500"
                  }`}
              >
                <MapPin className={`w-4 h-4 ${isLocating ? "animate-bounce" : ""}`} />
                {isLocating
                  ? "Mencari Lokasi..."
                  : userLocation
                    ? "Batalkan Lokasi Saya"
                    : "Lokasi Saya"}
              </button>
            </div>

            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800">
              <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-800 flex justify-between items-center">
                <span className="font-bold text-slate-100 flex items-center gap-2 truncate">
                  <Map className="w-4 h-4 text-teal-500 shrink-0" /> {locationText}
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 whitespace-nowrap">
                  {facilityCount} Fasilitas
                </span>
              </div>
              <div className="p-4 sm:p-6">
                {!userLocation ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                      <MapPin className="w-8 h-8 text-slate-700" />
                    </div>
                    <h3 className="text-slate-300 font-bold mb-2">Lokasi Belum Aktif</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                      Aktifkan fitur Lokasi Saya untuk melihat daftar kantor polisi dan rumah sakit terdekat.
                    </p>
                  </div>
                ) : facilities.length === 0 ? (
                  <div className="text-center py-12 flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-950 rounded-full flex items-center justify-center mb-4 border border-slate-800">
                      <Search className="w-8 h-8 text-slate-700" />
                    </div>
                    <h3 className="text-slate-300 font-bold mb-2">Fasilitas Tidak Ditemukan</h3>
                    <p className="text-slate-500 text-sm max-w-sm mx-auto">
                      Tidak ada data layanan darurat yang terdaftar di sistem untuk area ini.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {facilities.map((facility) => {
                      const isPolice = facility.category === "POLICE";
                      return (
                        <div key={facility.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between h-full">
                          <div>
                            <div className="flex justify-between items-start mb-1">
                              <div className="font-bold text-slate-200 text-lg truncate pr-2">
                                {facility.name}
                              </div>
                              {isPolice ? (
                                <Siren className="w-5 h-5 text-teal-500 shrink-0 mt-1" />
                              ) : (
                                <Hospital className="w-5 h-5 text-amber-500 shrink-0 mt-1" />
                              )}
                            </div>
                            <div className="text-slate-500 text-sm font-medium mb-2">
                              {facility.branch_name || (isPolice ? "Kantor Polisi" : "Rumah Sakit")}
                            </div>
                            <div className="flex items-start gap-1.5 text-xs text-slate-400 mb-4">
                              <Building2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                              <span className="line-clamp-2 leading-relaxed">{facility.address}</span>
                            </div>
                          </div>

                          <a
                            href={`tel:${facility.phone_number}`}
                            className={`w-full flex items-center justify-center gap-2 font-bold py-3 rounded-xl border transition-colors mt-auto ${isPolice
                              ? "text-teal-400 bg-teal-500/10 border-teal-500/20 hover:bg-teal-500/20"
                              : "text-amber-500 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20"
                              }`}
                          >
                            <Phone className="w-4 h-4" /> Hubungi: {facility.phone_number}
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
