"use client";

import { useState } from "react";
import { ChevronRight, Search, Settings2, ShieldCheck, Siren, Navigation, AlertTriangle, X, MapPin, Share2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect } from "react";

// Dummy data (Fallback)
const INITIAL_INCIDENTS = [
  {
    id: "WG-8492",
    date: "Oct 24, 2023",
    time: "23:45 WIB",
    title: "Begal (Armed Robbery)",
    type: "Begal",
    location: "Jl. Sudirman, near GBK Gate 3",
    distance: 2.4,
    risk: "CRITICAL",
    description: "Dua tersangka dengan sepeda motor hitam mendekati korban. Tersangka mengacungkan senjata tajam (celurit) dan menuntut dompet korban. Tersangka melarikan diri ke arah selatan menuju Blok M."
  }
];

export default function HistoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState([{ type: "RISK", value: "High" }]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [incidentsData, setIncidentsData] = useState<any[]>(INITIAL_INCIDENTS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const { data, error } = await supabase
          .from('incidents')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching incidents from Supabase:", error);
          setIncidentsData(INITIAL_INCIDENTS); // Fallback to dummy data
        } else if (data && data.length > 0) {
          // Map Supabase data to match component structure
          const mappedData = data.map((item: any) => ({
            id: `SB-${item.id}`,
            date: new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: item.time || new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
            title: item.title,
            type: item.type,
            location: item.location,
            distance: parseFloat(item.distance) || 0,
            risk: item.risk === 'TINGGI' ? 'CRITICAL' : item.risk === 'SEDANG' ? 'ELEVATED' : 'WATCH',
            description: item.description
          }));
          
          // Optionally filter by type here if we want to ensure no Jambret/Suspicious from DB
          setIncidentsData(mappedData.filter((d: any) => d.type !== 'Jambret' && d.type !== 'Suspicious'));
        } else {
          setIncidentsData(INITIAL_INCIDENTS);
        }
      } catch (err) {
        console.error("Failed to fetch from Supabase", err);
        setIncidentsData(INITIAL_INCIDENTS);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchIncidents();
  }, []);

  const removeFilter = (index: number) => {
    setActiveFilters(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
  };

  const toggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  // Filter based on search (simple title/location match)
  const filteredIncidents = incidentsData.filter(incident => {
    const matchesSearch = incident.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          incident.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Simplistic filter application just for demonstration based on dummy limits
    let matchesRisk = true;
    
    const riskFilters = activeFilters.filter(f => f.type === "RISK");
    if (riskFilters.length > 0) {
      matchesRisk = riskFilters.some(filter => {
        if (filter.value === "High" && incident.risk === "CRITICAL") return true;
        if (filter.value === "Medium" && incident.risk === "ELEVATED") return true;
        if (filter.value === "Low" && incident.risk === "WATCH") return true;
        return false;
      });
    }

    return matchesSearch && matchesRisk;
  });

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col relative z-10">
      
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-500 shadow-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
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
                <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase">Tingkat Resiko</label>
                <div className="flex flex-wrap gap-2">
                   {['High', 'Medium', 'Low'].map(risk => (
                    <button 
                      key={risk}
                      onClick={() => {
                          const newFilters = activeFilters.filter(f => f.type !== "RISK");
                          newFilters.push({ type: "RISK", value: risk });
                          setActiveFilters(newFilters);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold tracking-wider ${activeFilters.some(f => f.type === 'RISK' && f.value === risk) ? 'bg-teal-500/20 text-teal-400 border border-teal-500/50' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-600'}`}
                    >
                      {risk.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rentang Waktu */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase">Rentang Waktu</label>
                <select suppressHydrationWarning className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-sm">
                  <option>Hari Ini</option>
                  <option>7 Hari Terakhir</option>
                  <option>30 Hari Terakhir</option>
                </select>
              </div>

              {/* Lokasi Area */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase">Lokasi Area</label>
                <select suppressHydrationWarning className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-sm">
                  <option>Semua Lokasi</option>
                  <option>Jakarta Timur</option>
                  <option>Depok</option>
                  <option>Bekasi</option>
                  <option>Jakarta Selatan</option>
                  <option>Jakarta Pusat</option>
                </select>
              </div>
              
              {/* Status Verifikasi */}
              <div>
                <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase">Status Verifikasi</label>
                <select suppressHydrationWarning className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-sm">
                  <option>Semua</option>
                  <option>Terverifikasi Admin</option>
                  <option>Menunggu Validasi</option>
                </select>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          {activeFilters.map((filter, index) => (
             <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-full px-4 py-1.5 flex items-center gap-2 text-xs font-bold tracking-wider">
               <span className="text-slate-500">{filter.type}:</span> <span className="text-teal-400">{filter.value.toUpperCase()}</span>
               <button onClick={() => removeFilter(index)} className="hover:text-teal-400 text-slate-400 ml-1">
                 <X className="w-3 h-3" />
               </button>
             </div>
          ))}
          <button onClick={clearAllFilters} className="text-teal-500 hover:text-teal-400 text-xs font-bold tracking-wider px-2 py-1 transition-colors underline underline-offset-4 decoration-teal-500/30">
            CLEAR ALL
          </button>
        </div>
      )}

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
            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${incident.risk === "CRITICAL" ? "bg-red-500" : incident.risk === "ELEVATED" ? "bg-amber-500" : "bg-teal-500"}`}></div>
            
            <div className="col-span-2 flex flex-col mb-4 md:mb-0">
              <span className="text-slate-200 font-semibold text-lg md:text-base">{incident.date}</span>
              <span className="text-slate-500 text-sm font-medium">{incident.time}</span>
            </div>
            
            <div className="col-span-4 mb-4 md:mb-0 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${incident.risk === "CRITICAL" ? "bg-red-500/10 text-red-500 border-red-500/20" : incident.risk === "ELEVATED" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-teal-500/10 text-teal-500 border-teal-500/20"}`}>
                {incident.risk === "CRITICAL" && <Siren className="w-6 h-6" />}
                {incident.risk === "ELEVATED" && <AlertTriangle className="w-6 h-6" />}
                {incident.risk === "WATCH" && <ShieldCheck className="w-6 h-6" />}
              </div>
              <div>
                <div className="font-bold text-lg text-slate-100">{incident.title}</div>
                <div className="text-slate-500 text-sm md:hidden mt-0.5">{incident.distance} km away</div>
              </div>
            </div>
            
            <div className="col-span-3 mb-4 md:mb-0">
              <div className="text-slate-300 font-medium truncate">{incident.location}</div>
              <div className="text-slate-500 text-sm hidden md:flex items-center gap-1 mt-1">
                <Navigation className="w-3.5 h-3.5" />
                {incident.distance} km from you
              </div>
            </div>
            
            <div className="col-span-2 mb-4 md:mb-0 flex items-center">
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-bold tracking-wider ${incident.risk === "CRITICAL" ? "border-red-500/30 bg-red-500/10 text-red-500" : incident.risk === "ELEVATED" ? "border-amber-500/30 bg-amber-500/10 text-amber-500" : "border-teal-500/30 bg-teal-500/10 text-teal-500"}`}>
                {incident.risk === "CRITICAL" && <span className="w-2 h-2 rounded-full bg-red-500 blur-[1px] animate-pulse"></span>}
                {incident.risk === "ELEVATED" && <span className="w-2 h-2 rounded-full bg-amber-500"></span>}
                {incident.risk === "WATCH" && <span className="w-2 h-2 rounded-full bg-teal-500"></span>}
                {incident.risk}
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

      {/* Load More */}
      {filteredIncidents.length > 0 && (
        <div className="flex justify-center mt-12 mb-8">
          <button className="text-slate-300 bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 px-8 py-3 rounded-full transition-all flex items-center gap-3 font-semibold shadow-sm">
            Load More History
          </button>
        </div>
      )}

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg max-h-[90vh] rounded-2xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-800 flex justify-between items-start shrink-0">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-950 text-xs font-bold tracking-wider border ${selectedIncident.risk === 'CRITICAL' ? 'text-red-500 border-red-500/30' : selectedIncident.risk === 'ELEVATED' ? 'text-amber-500 border-amber-500/30' : 'text-teal-500 border-teal-500/30'}`}>
                    {selectedIncident.risk} RISK
                  </span>
                  <span className="text-slate-500 text-sm font-medium">ID: {selectedIncident.id}</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-100">{selectedIncident.title}</h2>
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
                  <div className="text-slate-200 font-semibold">{selectedIncident.date}</div>
                  <div className="text-slate-400 text-sm">{selectedIncident.time}</div>
                </div>
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-slate-500 text-xs font-bold tracking-wider mb-2">LOKASI</div>
                  <div className="text-slate-200 font-semibold line-clamp-1 truncate" title={selectedIncident.location}>{selectedIncident.location.split(',')[0]}</div>
                  <div className="text-slate-400 text-sm truncate" title={selectedIncident.location}>{selectedIncident.location.split(',')[1] || "Area"}</div>
                </div>
              </div>
              
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950">
                 <div 
                   className="flex justify-between items-center p-4 bg-slate-900/50 cursor-pointer hover:bg-slate-800/50 transition-colors"
                   onClick={(e) => {
                     const content = e.currentTarget.nextElementSibling as HTMLElement;
                     if (content.style.maxHeight === '0px' || !content.style.maxHeight) {
                       content.style.maxHeight = content.scrollHeight + 'px';
                       e.currentTarget.querySelector('svg')?.classList.add('rotate-90');
                     } else {
                       content.style.maxHeight = '0px';
                       e.currentTarget.querySelector('svg')?.classList.remove('rotate-90');
                     }
                   }}
                 >
                   <div className="text-slate-400 text-xs font-bold tracking-wider">DESKRIPSI INSIDEN</div>
                   <button className="text-slate-400 hover:text-teal-400 transition-colors">
                     <ChevronRight className="w-5 h-5 rotate-90 transition-transform duration-300" />
                   </button>
                 </div>
                 <div className="transition-all duration-300 ease-in-out overflow-hidden" style={{ maxHeight: '1000px' }}>
                    <div className="p-4 border-t border-slate-800">
                      <p className="text-slate-300 leading-relaxed max-h-[30vh] overflow-y-auto custom-scrollbar pr-2 mb-4">
                        {selectedIncident.description}
                      </p>
                      
                      {/* Map Placeholder in Modal */}
                      <div className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden flex items-center justify-center shrink-0">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #14b8a6 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
                        <div className="relative z-10 flex flex-col items-center drop-shadow-2xl">
                          <MapPin className={`w-8 h-8 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] ${selectedIncident.risk === 'CRITICAL' ? 'text-red-500 animate-bounce' : selectedIncident.risk === 'ELEVATED' ? 'text-amber-500' : 'text-teal-500'}`} />
                          <div className="w-2 h-2 bg-slate-400 rounded-full mt-1 opacity-50"></div>
                        </div>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-800 bg-slate-900/50 flex gap-4 rounded-b-2xl shrink-0">
              <button 
                onClick={() => alert('Fitur Share belum tersedia.')}
                className="flex-1 bg-transparent border border-slate-700 text-slate-300 py-3 rounded-xl hover:bg-slate-800 hover:text-slate-200 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Alert
              </button>
              <button 
                onClick={() => router.push('/')}
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

