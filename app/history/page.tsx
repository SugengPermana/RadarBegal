"use client";

import { useState, Suspense } from "react";
import { ChevronRight, Search, Settings2, ShieldCheck, Siren, Navigation, AlertTriangle, X, MapPin, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useBerita } from "@/providers/BeritaProvider";
import { useFilters } from "@/hooks/useFilters";
import { BeritaBegal } from "@/types/begal";

export default function HistoryPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="text-slate-500 animate-pulse">Loading...</div></div>}>
      <HistoryContent />
    </Suspense>
  );
}

function HistoryContent() {
  const router = useRouter();
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<BeritaBegal | null>(null);

  const { beritaData, isLoading } = useBerita();
  const { filters, setFilter, applyFilters, clearFilters } = useFilters();

  const filteredIncidents = applyFilters(beritaData);

  const toggleFilterPanel = () => setShowFilterPanel(!showFilterPanel);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col relative z-10 pt-20">
      
      {/* Header & Search/Filter Bar */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-100 mb-2 tracking-tight">Incident Logs</h1>
          <p className="text-slate-400 text-lg">Historical record of all reported events in monitored zones.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto relative">
          {/* Search Input */}
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search incidents..." 
              value={filters.q}
              onChange={(e) => setFilter("q", e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-500 shadow-sm"
            />
            {filters.q && (
              <button 
                onClick={() => setFilter("q", "")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Filter Button */}
          <button 
            onClick={toggleFilterPanel}
            className={`bg-slate-900 border ${showFilterPanel ? 'border-teal-500 text-teal-400' : 'border-slate-800 text-slate-300'} px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors font-medium shadow-sm whitespace-nowrap`}
          >
            <Settings2 className="w-5 h-5" />
            Filters
          </button>

          {/* Advanced Filter Panel Dropdown */}
          {showFilterPanel && (
            <div className="absolute top-[110%] right-0 w-72 md:w-80 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 flex flex-col gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
              
              <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-1 shrink-0">
                <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm"><Settings2 className="w-4 h-4 text-teal-500" /> Filter</h3>
                <button onClick={() => setShowFilterPanel(false)} className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-800">
                   <X className="w-4 h-4" />
                </button>
              </div>

              {/* Tingkat Resiko */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase">Tingkat Risiko</label>
                <select 
                  value={filters.risiko}
                  onChange={(e) => setFilter('risiko', e.target.value)}
                  suppressHydrationWarning 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-sm"
                >
                  <option>Semua</option>
                  <option>CRITICAL</option>
                  <option>ELEVATED</option>
                  <option>WATCH</option>
                </select>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase">Kategori Kriminal</label>
                <select 
                  value={filters.kategori}
                  onChange={(e) => setFilter('kategori', e.target.value)}
                  suppressHydrationWarning 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-sm"
                >
                  <option>Semua</option>
                  <option>Begal</option>
                  <option>Jambret</option>
                  <option>Suspicious</option>
                  <option>Kriminal</option>
                </select>
              </div>

              {/* Rentang Waktu */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase">Rentang Waktu</label>
                <select 
                  value={filters.rentang}
                  onChange={(e) => setFilter('rentang', e.target.value)}
                  suppressHydrationWarning 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-sm"
                >
                  <option>Semua</option>
                  <option>Hari Ini</option>
                  <option>7 Hari Terakhir</option>
                  <option>30 Hari Terakhir</option>
                </select>
              </div>
              
              {/* Status Verifikasi */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase">Status Verifikasi</label>
                <select 
                  value={filters.status}
                  onChange={(e) => setFilter('status', e.target.value)}
                  suppressHydrationWarning 
                  className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-sm"
                >
                  <option>Semua</option>
                  <option>Terverifikasi Admin</option>
                  <option>Menunggu Validasi</option>
                </select>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button onClick={clearFilters} className="text-teal-500 hover:text-teal-400 text-xs font-bold tracking-wider px-2 py-1 transition-colors underline underline-offset-4 decoration-teal-500/30">
          CLEAR ALL FILTERS
        </button>
      </div>

      {/* Data List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-slate-500">Loading history...</div>
        ) : filteredIncidents.length === 0 ? (
          <div className="text-center py-12 text-slate-500">Tidak ada insiden yang sesuai dengan filter atau pencarian.</div>
        ) : filteredIncidents.map((incident) => (
          <div 
            key={incident.id}
            onClick={() => setSelectedIncident(incident)}
            className="bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800/80 transition-all cursor-pointer group relative overflow-hidden flex flex-col md:grid md:grid-cols-12 md:gap-6 md:items-center p-5 md:px-8 md:py-6 shadow-sm"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${incident.tingkat_risiko === "CRITICAL" ? "bg-red-500" : incident.tingkat_risiko === "ELEVATED" ? "bg-amber-500" : "bg-teal-500"}`}></div>
            
            <div className="col-span-2 flex flex-col mb-4 md:mb-0">
              <span className="text-slate-200 font-semibold text-lg md:text-base">{new Date(incident.created_at).toLocaleDateString()}</span>
              <span className="text-slate-500 text-sm font-medium">{new Date(incident.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            
            <div className="col-span-4 mb-4 md:mb-0 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${incident.tingkat_risiko === "CRITICAL" ? "bg-red-500/10 text-red-500 border-red-500/20" : incident.tingkat_risiko === "ELEVATED" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-teal-500/10 text-teal-500 border-teal-500/20"}`}>
                {incident.tingkat_risiko === "CRITICAL" && <Siren className="w-6 h-6" />}
                {incident.tingkat_risiko === "ELEVATED" && <AlertTriangle className="w-6 h-6" />}
                {incident.tingkat_risiko === "WATCH" && <ShieldCheck className="w-6 h-6" />}
              </div>
              <div>
                <div className="font-bold text-lg text-slate-100">{incident.judul}</div>
                <div className="text-slate-500 text-sm md:hidden mt-0.5">{incident.kategori}</div>
              </div>
            </div>
            
            <div className="col-span-3 mb-4 md:mb-0">
              <div className="text-slate-300 font-medium truncate">{incident.lokasi}</div>
              <div className="text-slate-500 text-sm hidden md:flex items-center gap-1 mt-1">
                <Navigation className="w-3.5 h-3.5" />
                {incident.status_verifikasi}
              </div>
            </div>
            
            <div className="col-span-2 mb-4 md:mb-0 flex items-center">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-bold tracking-wider ${incident.tingkat_risiko === "CRITICAL" ? "border-red-500/30 bg-red-500/10 text-red-500" : incident.tingkat_risiko === "ELEVATED" ? "border-amber-500/30 bg-amber-500/10 text-amber-500" : "border-teal-500/30 bg-teal-500/10 text-teal-500"}`}>
                {incident.tingkat_risiko === "CRITICAL" && <span className="w-2 h-2 rounded-full bg-red-500 blur-[1px] animate-pulse"></span>}
                {incident.tingkat_risiko === "ELEVATED" && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                {incident.tingkat_risiko === "WATCH" && <span className="w-2 h-2 rounded-full bg-teal-500"></span>}
                {incident.tingkat_risiko}
              </span>
            </div>
            
            <div className="col-span-1 flex justify-end">
              <div className="text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-all p-2 bg-slate-950 rounded-full group-hover:bg-teal-500/10">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-start shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950 text-xs font-bold tracking-wider border ${selectedIncident.tingkat_risiko === 'CRITICAL' ? 'text-red-500 border-red-500/30' : selectedIncident.tingkat_risiko === 'ELEVATED' ? 'text-amber-500 border-amber-500/30' : 'text-teal-500 border-teal-500/30'}`}>
                    {selectedIncident.tingkat_risiko} RISK
                  </span>
                  <span className="text-slate-500 text-sm font-medium">ID: {selectedIncident.id}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-100">{selectedIncident.judul}</h2>
              </div>
              <button 
                onClick={() => setSelectedIncident(null)}
                className="text-slate-500 hover:text-slate-300 hover:bg-slate-800 p-2 rounded-full transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-slate-500 text-xs font-bold tracking-wider mb-2">WAKTU KEJADIAN</div>
                  <div className="text-slate-200 font-semibold">{new Date(selectedIncident.created_at).toLocaleDateString()}</div>
                  <div className="text-slate-400 text-sm">{new Date(selectedIncident.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-slate-500 text-xs font-bold tracking-wider mb-2">LOKASI</div>
                  <div className="text-slate-200 font-semibold line-clamp-1 truncate" title={selectedIncident.lokasi}>{selectedIncident.lokasi}</div>
                </div>
              </div>
              
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                 <div className="flex justify-between items-center p-4 bg-slate-900/50 transition-colors">
                   <div className="text-slate-400 text-xs font-bold tracking-wider">DESKRIPSI INSIDEN</div>
                 </div>
                 <div className="p-4 border-t border-slate-800">
                   <p className="text-slate-300 leading-relaxed max-h-[30vh] overflow-y-auto custom-scrollbar pr-2 mb-4">
                     {selectedIncident.isi_berita}
                   </p>
                 </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex gap-4 rounded-b-2xl shrink-0">
              <button 
                onClick={() => router.push(`/berita/${selectedIncident.id}`)}
                className="flex-1 bg-transparent border border-slate-700 text-slate-300 py-3 rounded-xl hover:bg-slate-800 hover:text-slate-200 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                Baca Lengkap
              </button>
              <button 
                onClick={() => {
                   setFilter("id", selectedIncident.id.toString());
                   router.push(`/?id=${selectedIncident.id}`);
                }}
                className="flex-1 bg-teal-600 text-white shadow-[0_0_20px_rgba(13,148,136,0.3)] py-3 rounded-xl hover:bg-teal-500 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                View on Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
