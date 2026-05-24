"use client";

import { useState, Suspense } from "react";
import { MapPin, Filter, X, CheckCircle2, AlertCircle, Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import MapContainer from "@/components/MapContainer";
import { useBerita } from "@/providers/BeritaProvider";
import { useFilters } from "@/hooks/useFilters";
import { BeritaBegal } from "@/types/begal";

export default function Dashboard() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center bg-slate-950"><div className="text-slate-500 animate-pulse">Loading...</div></div>}>
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [radius, setRadius] = useState(5);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);

  const { beritaData, isLoading } = useBerita();
  const { filters, setFilter, applyFilters } = useFilters();

  const filteredBerita = applyFilters(beritaData);
  const selectedBerita = beritaData.find(b => b.id.toString() === filters.id) || null;

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError("");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsLocating(false);
          setRadius(3);
        },
        () => {
          setIsLocating(false);
          setLocationError("Akses lokasi ditolak");
        }
      );
    } else {
      setIsLocating(false);
      setLocationError("Geolokasi tidak didukung");
    }
  };

  const handleSelectBerita = (berita: BeritaBegal | null) => {
    if (berita) {
      setFilter("id", berita.id.toString());
    } else {
      setFilter("id", "");
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
        {/* Sidebar Toggle Button */}
        <button
          suppressHydrationWarning
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute z-40 top-1/2 -translate-y-1/2 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-slate-300 p-2.5 rounded-l-2xl shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 hover:text-teal-400 hover:bg-slate-800 ${
            isSidebarOpen ? 'right-0 lg:right-[400px] xl:right-[450px]' : 'right-0'
          }`}
        >
          {isSidebarOpen ? (
            <ChevronRight className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-teal-500" />
          )}
        </button>

      {/* Stats Bar */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20 hidden lg:flex items-center gap-4 bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-full px-6 py-3 shadow-lg">
        <span className="flex h-3 w-3 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
        </span>
        <p className="font-semibold text-slate-200">
          Laporan Berita: <span className="font-bold text-teal-400">{filteredBerita.length}</span>
        </p>
      </div>

      {/* Google Map Container Integration */}
      <div className="absolute inset-0 z-0 bg-slate-950 border-t border-slate-800 md:border-none">
        <MapContainer 
          beritaList={filteredBerita} 
          selectedBerita={selectedBerita} 
          onSelectBerita={handleSelectBerita} 
          radiusMeter={radius * 10}
        />
      </div>

      {/* overlay yang muncul pada saat titik di click user */}
      <div 
        className={`pointer-events-auto absolute bottom-24 md:bottom-auto md:top-1/2 left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 bg-slate-900 rounded-2xl border border-slate-800 p-5 w-[calc(100%-32px)] md:w-80 shadow-2xl z-20 transition-all duration-300 ${selectedBerita ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
      >
        {selectedBerita && (
           <>
             <button 
               suppressHydrationWarning
               onClick={() => setFilter("id", "")}
               className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 bg-slate-800/50 hover:bg-slate-800 p-1.5 rounded-full transition-colors"
             >
               <X className="w-4 h-4" />
             </button>
             <div className="flex items-start gap-4 pr-6">
               <div className={`p-2.5 rounded-xl shrink-0 ${selectedBerita.tingkat_risiko === 'CRITICAL' ? 'bg-red-500/20 text-red-500' : selectedBerita.tingkat_risiko === 'ELEVATED' ? 'bg-orange-500/20 text-orange-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                 <AlertCircle className="w-6 h-6" />
               </div>
               <div className="flex-1 min-w-0">
                 <h3 className="font-semibold text-lg text-slate-100 truncate pr-2" title={selectedBerita.judul}>{selectedBerita.judul}</h3>
                 <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{new Date(selectedBerita.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short'})}</p>
                 <p className="text-sm text-slate-400 mt-3 leading-relaxed line-clamp-3">
                   {selectedBerita.isi_berita}
                 </p>
                 <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                   <MapPin className="w-3.5 h-3.5" />
                   {selectedBerita.lokasi}
                 </div>
                 <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {selectedBerita.status_verifikasi}
                 </div>
                 <button 
                   suppressHydrationWarning 
                   onClick={() => router.push(`/berita/${selectedBerita.id}`)}
                   className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl transition-colors text-sm font-semibold border border-slate-700/50"
                 >
                   Detail Selengkapnya
                 </button>
               </div>
             </div>
           </>
         )}
      </div>

      {/* Right Sidebar: Live Feed & Analytics */}
      <div 
        className={`absolute bottom-0 right-0 z-40 bg-slate-950/95 backdrop-blur-3xl border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col h-[60vh] lg:h-full w-full lg:w-[400px] xl:w-[450px] transition-transform duration-500 ease-in-out ${
          isSidebarOpen 
            ? 'translate-y-0 lg:translate-x-0' 
            : 'translate-y-full lg:translate-y-0 lg:translate-x-full'
        }`}
      >
        <div className="w-full lg:w-[400px] xl:w-[450px] h-full flex flex-col min-w-[320px]">
        {/* Filter Pantauan Sidebar */}
        <div className="border-b border-slate-800 bg-slate-900/40 flex flex-col shrink min-h-0">
          <div 
            className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-800/50 transition-colors shrink-0"
            onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
          >
            <h2 className="font-semibold text-base text-slate-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-red-500" />
              Filter Pantauan
            </h2>
            <button suppressHydrationWarning className="text-slate-400 hover:text-teal-400 transition-colors">
              {isFilterPanelOpen ? <ChevronRight className="w-5 h-5 rotate-90 transition-transform" /> : <ChevronRight className="w-5 h-5 transition-transform" />}
            </button>
          </div>
          
          <div className={`flex flex-col gap-4 overflow-y-auto custom-scrollbar transition-all duration-300 ${isFilterPanelOpen ? 'max-h-[60vh] p-4 pt-0 opacity-100' : 'max-h-0 p-0 opacity-0 overflow-hidden'}`}>
            <div className="grid grid-cols-2 gap-3">
              {/* Rentang Waktu */}
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-500 mb-1.5 uppercase">Rentang Waktu</label>
                <select 
                  value={filters.rentang}
                  onChange={(e) => setFilter('rentang', e.target.value)}
                  suppressHydrationWarning 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-xs"
                >
                  <option>Semua</option>
                  <option>Hari Ini</option>
                  <option>7 Hari Terakhir</option>
                  <option>30 Hari Terakhir</option>
                </select>
              </div>

              {/* Tingkat Risiko */}
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-500 mb-1.5 uppercase">Tingkat Risiko</label>
                <select 
                  value={filters.risiko}
                  onChange={(e) => setFilter('risiko', e.target.value)}
                  suppressHydrationWarning 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-xs"
                >
                  <option>Semua</option>
                  <option>CRITICAL</option>
                  <option>ELEVATED</option>
                  <option>CAUTION</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
               {/* Status Verifikasi */}
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-500 mb-1.5 uppercase">Status Verifikasi</label>
                <select 
                  value={filters.status}
                  onChange={(e) => setFilter('status', e.target.value)}
                  suppressHydrationWarning 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-xs"
                >
                  <option>Semua</option>
                  <option>Terverifikasi</option>
                  <option>Belum Verifikasi</option>
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
                <MapPin className={`w-3 h-3 ${isLocating ? 'animate-bounce' : ''}`} />
                {isLocating ? 'Mencari...' : 'Lokasi Saya'}
              </button>
              {locationError && <p className="text-[10px] text-red-500 mt-2 text-center">{locationError}</p>}
            </div>
          </div>
        </div>

        {/* Live Incident Feed Panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="p-6 pb-2">
             <h3 className="text-sm font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
               <span className="relative flex h-2.5 w-2.5">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
               </span>
               Live Laporan Berita
             </h3>
          </div>
          
          {/* isi detail dari live laporang side bar kanan */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isLoading ? (
              [...Array(4)].map((_, idx) => (
                <div key={`skeleton-${idx}`} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 animate-pulse">
                  <div className="flex justify-between items-start mb-3">
                     <div className="h-6 w-20 bg-slate-800 rounded"></div>
                     <div className="h-6 w-16 bg-slate-800 rounded"></div>
                  </div>
                  <div className="h-4 w-3/4 bg-slate-800 rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-slate-800 rounded mb-4"></div>
                  <div className="flex items-center justify-between border-t border-slate-800/50 pt-3">
                    <div className="h-4 w-24 bg-slate-800 rounded"></div>
                    <div className="h-4 w-12 bg-slate-800 rounded"></div>
                  </div>
                </div>
              ))
            ) : filteredBerita.length === 0 ? (
               <p className="text-slate-500 text-sm text-center py-4">Belum ada laporan sesuai filter</p>
            ) : (
              filteredBerita.map((feed) => (
                <div 
                  key={feed.id} 
                  className={`bg-slate-900 border ${selectedBerita?.id === feed.id ? 'border-yellow-500' : 'border-slate-800'} rounded-2xl p-4 hover:border-slate-700 transition-colors cursor-pointer group`}
                  onClick={() => {
                    handleSelectBerita(feed);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                     <div className="flex gap-2">
                       <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border ${feed.tingkat_risiko === 'CRITICAL' ? 'bg-red-500/10 text-red-500 border-red-500/20' : feed.tingkat_risiko === 'ELEVATED' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                         {feed.kategori}
                       </span>
                     </div>
                     <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950 px-2 py-1 rounded border border-slate-800">
                       <Clock className="w-3 h-3" />
                       {new Date(feed.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                     </div>
                  </div>
                  
                  {/* live laporan judul dan lokasi */}
                  <h4 className="font-bold text-slate-200 text-sm mb-1 group-hover:text-teal-400 transition-colors truncate">{feed.judul}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 truncate">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    {feed.lokasi}
                  </div>

                  {/*  */}
                  <div className="flex items-center justify-between border-t border-slate-800/50 pt-3">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${feed.status_verifikasi === 'Terverifikasi Admin' ? 'text-teal-500' : 'text-amber-500'}`}>
                       {feed.status_verifikasi === 'Terverifikasi Admin' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                       {feed.status_verifikasi}
                    </div>
                    <button suppressHydrationWarning className="text-xs font-bold text-slate-500 group-hover:text-slate-300 transition-colors">
                      Detail &rarr;
                    </button>
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
