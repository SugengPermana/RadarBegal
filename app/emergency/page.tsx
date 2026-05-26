"use client";

import Link from "next/link";
import {
  PhoneCall,
  Siren,
  Flame,
  Waves,
  Landmark,
  Hospital,
  Navigation,
  Search,
  Phone,
  Map,
  FileWarning,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { ReportForm } from "@/components/ReportForm";
import { useState } from "react";

export default function EmergencyPage() {
  const { user, isLoading } = useAuth();
  const [showReportForm, setShowReportForm] = useState(false);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-[1200px] mx-auto w-full flex flex-col pt-20 md:pt-8 bg-slate-950 relative z-10">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.6)]" />
          <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">
            Local Risk Level: <span className="text-amber-500">WARNING</span>
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Navigation className="w-4 h-4" />
          Jakarta Selatan
        </div>
      </div>

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
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <a
              href="tel:110"
              className="group bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/80 transition-all duration-300 rounded-3xl p-6 md:p-8 text-left relative overflow-hidden h-48 sm:h-56 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start relative z-10 w-full">
                <div className="bg-slate-950 border border-slate-800 text-teal-400 p-3 md:p-4 rounded-2xl group-hover:bg-teal-500 group-hover:text-slate-900 transition-colors">
                  <Siren className="w-8 h-8 md:w-9 md:h-9" />
                </div>
                <span className="font-bold tracking-wider text-xs bg-slate-950 text-slate-400 px-4 py-2 rounded-full border border-slate-800 uppercase">
                  Polisi
                </span>
              </div>
              <div className="relative z-10 mt-auto">
                <div className="text-5xl md:text-6xl font-black text-slate-100 group-hover:text-teal-400 transition-colors mb-1 tracking-tight">
                  110
                </div>
                <div className="text-slate-400 font-medium text-sm md:text-base">
                  Bantuan Polisi Segera
                </div>
              </div>
            </a>

            <a
              href="tel:118"
              className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 transition-all duration-300 rounded-3xl p-6 md:p-8 text-left relative overflow-hidden h-48 sm:h-56 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start relative z-10 w-full">
                <div className="bg-slate-950 border border-slate-800 text-amber-500 p-3 md:p-4 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors">
                  <Hospital className="w-8 h-8 md:w-9 md:h-9" />
                </div>
                <span className="font-bold tracking-wider text-xs bg-slate-950 text-slate-400 px-4 py-2 rounded-full border border-slate-800 uppercase">
                  Ambulans
                </span>
              </div>
              <div className="relative z-10 mt-auto">
                <div className="text-5xl md:text-6xl font-black text-slate-100 group-hover:text-amber-500 transition-colors mb-1 tracking-tight">
                  118
                </div>
                <div className="text-slate-400 font-medium text-sm md:text-base">Darurat Medis</div>
              </div>
            </a>

            <div className="md:col-span-2 grid grid-cols-2 gap-4 md:gap-6 mt-2">
              <a
                href="tel:113"
                className="bg-slate-900/40 border border-slate-800 hover:bg-slate-800/80 hover:border-red-500/40 transition-all rounded-2xl p-4 md:p-5 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-red-400 bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    <Flame className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-100">113</div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Damkar</div>
                  </div>
                </div>
                <PhoneCall className="w-5 h-5 text-slate-600 group-hover:text-red-400 hidden sm:block" />
              </a>

              <a
                href="tel:115"
                className="bg-slate-900/40 border border-slate-800 hover:bg-slate-800/80 hover:border-blue-500/40 transition-all rounded-2xl p-4 md:p-5 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <div className="text-blue-400 bg-slate-950 border border-slate-800 p-3 rounded-xl">
                    <Waves className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-slate-100">115</div>
                    <div className="text-xs font-bold text-slate-500 uppercase">Basarnas</div>
                  </div>
                </div>
                <PhoneCall className="w-5 h-5 text-slate-600 group-hover:text-blue-400 hidden sm:block" />
              </a>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">
                Regional Directory
              </h2>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari area atau fasilitas..."
                  className="bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500 w-full sm:w-72"
                />
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800">
              <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-800 flex justify-between items-center">
                <span className="font-bold text-slate-100 flex items-center gap-2">
                  <Map className="w-4 h-4 text-teal-500" /> DKI Jakarta
                </span>
                <span className="text-xs font-bold text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                  12 Fasilitas
                </span>
              </div>
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                  <div className="font-bold text-slate-200 text-lg mb-1">Polda Metro Jaya</div>
                  <div className="text-slate-500 text-sm font-medium mb-4">Markas Besar Polisi</div>
                  <a
                    href="tel:0215234000"
                    className="w-full flex items-center justify-center gap-2 font-bold text-teal-400 bg-teal-500/10 py-3 rounded-xl border border-teal-500/20"
                  >
                    <Phone className="w-4 h-4" /> Hubungi: 021-5234000
                  </a>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                  <div className="font-bold text-slate-200 text-lg mb-1">RSUPN Cipto M.</div>
                  <div className="text-slate-500 text-sm font-medium mb-4">Rumah Sakit (IGD)</div>
                  <a
                    href="tel:0211500135"
                    className="w-full flex items-center justify-center gap-2 font-bold text-amber-500 bg-amber-500/10 py-3 rounded-xl border border-amber-500/20"
                  >
                    <Phone className="w-4 h-4" /> Hubungi: 021-1500135
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 hidden lg:flex flex-col relative h-[calc(100vh-140px)] sticky top-24">
          <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative flex flex-col items-center justify-center">
            <div
              className="absolute inset-0 opacity-40 mix-blend-luminosity grayscale"
              style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop")`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="relative z-10 flex flex-col items-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center mb-6">
                <Landmark className="w-8 h-8 text-teal-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Peta Fasilitas</h3>
              <p className="text-slate-400 text-sm max-w-[250px]">
                Gunakan tombol Lapor Kejadian untuk melaporkan insiden keamanan di sekitar Anda.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
