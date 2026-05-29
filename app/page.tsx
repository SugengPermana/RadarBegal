"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, MapPin, Search, Filter, ShieldAlert, X, CheckCircle2, AlertCircle, Clock, TrendingUp, Activity, ChevronRight, ChevronLeft } from "lucide-react";
import Link from "next/link";

const MAP_INCIDENTS = [
  {
    id: 1,
    title: "Potensi Begal Fatal",
    time: "02:14 AM",
    timeElapsed: "10 mins ago",
    distance: "1.2km dari Anda",
    description: "AI mendeteksi anomali pergerakan sekelompok motor berhenti di area minim cahaya mencurigakan membawa senjata tajam.",
    risk: "TINGGI",
    lat: 40,
    lng: 35,
    type: "Kriminal",
    location: "Sudirman",
    isVerified: false
  },
  {
    id: 2,
    title: "Laporan Begal Berenjata",
    time: "03:30 AM",
    timeElapsed: "45 mins ago",
    distance: "3.5km dari Anda",
    description: "Seseorang melaporkan pembegalan fatal dengan senjata tajam, pengambilan motor dan barang berharga korban.",
    risk: "TINGGI",
    lat: 65,
    lng: 60,
    type: "Kriminal",
    location: "Kuningan",
    isVerified: true
  },
  {
    id: 3,
    title: "Komplotan Meresahkan",
    time: "04:20 AM",
    timeElapsed: "2 hours ago",
    distance: "5.0km dari Anda",
    description: "Kamera CCTV menangkap kawanan mencurigakan menggunakan senjata tajam melakukan penyisiran target begal.",
    risk: "SEDANG",
    lat: 25,
    lng: 70,
    type: "Kriminal",
    location: "Kemang",
    isVerified: true
  }
];



export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number | null>(1);
  const [radius, setRadius] = useState(5);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAlertToast, setShowAlertToast] = useState(false);
  const [isLoadingIncidents, setIsLoadingIncidents] = useState(true);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const loadingTimer = setTimeout(() => setIsLoadingIncidents(false), 2000);

    // Parse URL for incident id targeting
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedIncidentId(parseInt(id, 10));
        // clear the URL without reloading
        window.history.replaceState(null, '', window.location.pathname);
      }
    }

    // Simulate real-time alert pop-up after 3 seconds
    const timer = setTimeout(() => setShowAlertToast(true), 3000);
    return () => {
      clearTimeout(timer);
      clearTimeout(loadingTimer);
    };
  }, []);

  const filteredIncidents = MAP_INCIDENTS.filter(inc => 
    inc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    inc.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedIncident = MAP_INCIDENTS.find(inc => inc.id === selectedIncidentId);

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError("");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          // Just as an example, update radius to 3 to show action
          setRadius(3);
        },
        (error) => {
          setIsLocating(false);
          setLocationError("Akses lokasi ditolak");
        }
      );
    } else {
      setIsLocating(false);
      setLocationError("Geolokasi tidak didukung");
    }
  };

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-950">
      
      {/* Real-Time Alert Toast / Pop-up */}
      {showAlertToast && (
        <div className={`fixed top-20 z-50 w-80 bg-slate-900 border border-red-500/50 rounded-2xl shadow-[0_0_30px_rgba(239,68,68,0.2)] p-4 animate-in slide-in-from-right-10 fade-in duration-500 transition-all ${isSidebarOpen ? 'right-4 lg:right-[420px] xl:right-[470px]' : 'right-4 md:right-8'}`}>
          <button 
             suppressHydrationWarning
             onClick={() => setShowAlertToast(false)}
             className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-start gap-3">
             <div className="w-10 h-10 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 border border-red-500/30">
               <ShieldAlert className="w-5 h-5 animate-pulse" />
             </div>
             <div>
               <h4 className="font-bold text-red-500 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                 PERINGATAN BEGAL
               </h4>
               <p className="text-sm text-slate-200 mt-1 font-semibold">Begal Sajam dilaporkan di Kuningan</p>
               <span className="text-xs text-slate-400 mt-1 block">Baru saja • Jarak 1.5km</span>
             </div>
          </div>
        </div>
      )}

      {/* Map Area */}
      <div className="flex-1 relative flex flex-col w-full h-full">

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
          Hari ini: <span className="font-bold text-teal-400">12 laporan</span> <span className="text-slate-600 mx-2">|</span> <span className="font-bold text-amber-500">3 zona kritis</span>
        </p>
      </div>

      {/* Search Bar */}
      <div className={`absolute top-4 left-4 md:top-8 md:left-auto z-20 w-[calc(100%-80px)] sm:w-[400px] transition-all duration-500 ${isSidebarOpen ? 'lg:right-[480px] xl:right-[530px] md:right-[420px]' : 'md:right-24'}`}>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
          <input 
            suppressHydrationWarning
            type="text" 
            placeholder="Cari lokasi atau insiden..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-800 text-slate-200 rounded-full py-3 pl-12 pr-10 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-500 shadow-lg"
          />
          {searchQuery && (
            <button 
              suppressHydrationWarning
              onClick={() => setSearchQuery("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>


      {/* Map Background Placeholder */}
      <div className="absolute inset-0 z-0 bg-slate-950 border-t border-slate-800 md:border-none">
        <div 
          className="w-full h-full opacity-40 mix-blend-luminosity grayscale"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        {/* Heatmap Overlay Simulation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className={`absolute top-[40%] left-[30%] w-96 h-96 bg-red-500/10 rounded-full blur-[100px] transition-all duration-1000 ${radius > 4 ? 'scale-110' : 'scale-75 opacity-50'}`}></div>
           <div className={`absolute top-[60%] left-[60%] w-80 h-80 bg-red-500/10 rounded-full blur-[80px] transition-all duration-1000 ${radius > 4 ? 'scale-100' : 'scale-50 opacity-50'}`}></div>
        </div>

        {/* Central User Location */}
        <div 
          className="absolute top-1/2 left-1/2 z-0 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        >
          <div className="w-4 h-4 bg-teal-400 rounded-full border-[3px] border-slate-900 animate-pulse relative z-10 shadow-[0_0_15px_rgba(45,212,191,0.8)]"></div>
          <span className="absolute w-12 h-12 rounded-full bg-teal-500 animate-ping opacity-30"></span>
        </div>

        {/* Map Zone Radius Overlays generated from Filtered Incidents */}
        {filteredIncidents.map((incident) => (
          <div 
            key={`zone-${incident.id}`}
            className={`absolute z-0 pointer-events-none rounded-full border transform -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ${selectedIncidentId === incident.id ? 'bg-red-500/20 border-red-500/40 animate-pulse' : 'bg-red-500/10 border-red-500/20'}`}
            style={{ 
              top: `${incident.lat}%`, 
              left: `${incident.lng}%`,
              width: `${Math.max(80, radius * 40)}px`, 
              height: `${Math.max(80, radius * 40)}px` 
            }}
          ></div>
        ))}

        {/* Map Markers generated from Filtered Incidents */}
        {filteredIncidents.map((incident) => (
          <button 
            suppressHydrationWarning
            key={incident.id} 
            onClick={() => setSelectedIncidentId(incident.id)}
            className="absolute z-10 w-10 h-10 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-auto group transition-transform hover:scale-110"
            style={{ top: `${incident.lat}%`, left: `${incident.lng}%` }}
          >
            {selectedIncidentId === incident.id && (
              <span className="absolute -inset-4 rounded-full border border-teal-400 bg-teal-400/20 blur-sm animate-pulse z-0 pointer-events-none"></span>
            )}
            {incident.risk === "TINGGI" && (
              <>
                <span className="absolute w-full h-full bg-red-500 rounded-full animate-ping opacity-50 z-10"></span>
                <div className={`relative z-20 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.6)] ${selectedIncidentId === incident.id ? 'ring-4 ring-teal-400 border-teal-400' : 'border-2 border-slate-900'} group-hover:border-red-300 transition-all`}>
                  <ShieldAlert className={`w-5 h-5 ${selectedIncidentId === incident.id ? 'text-white' : 'text-slate-950'}`} />
                </div>
              </>
            )}
            {incident.risk === "SEDANG" && (
              <>
                <span className="absolute w-full h-full bg-amber-500 rounded-full animate-ping opacity-40 z-10"></span>
                <div className={`relative z-20 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.6)] ${selectedIncidentId === incident.id ? 'ring-4 ring-teal-400 border-teal-400' : 'border-2 border-slate-900'} group-hover:border-amber-300 transition-all`}>
                  <ShieldAlert className={`w-5 h-5 ${selectedIncidentId === incident.id ? 'text-white' : 'text-slate-950'}`} />
                </div>
              </>
            )}
          </button>
        ))}
      </div>

      {/* Dynamic Marker Popup */}
      <div 
        className={`pointer-events-auto absolute bottom-24 md:bottom-auto md:top-1/2 left-1/2 transform -translate-x-1/2 md:-translate-y-1/2 bg-slate-900 rounded-2xl border border-slate-800 p-5 w-[calc(100%-32px)] md:w-80 shadow-2xl z-20 transition-all duration-300 ${selectedIncident ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"}`}
      >
        {selectedIncident && (
           <>
             <button 
               suppressHydrationWarning
               onClick={() => setSelectedIncidentId(null)}
               className="absolute top-3 right-3 text-slate-500 hover:text-slate-300 bg-slate-800/50 hover:bg-slate-800 p-1.5 rounded-full transition-colors"
             >
               <X className="w-4 h-4" />
             </button>
             <div className="flex items-start gap-4 pr-6">
               <div className={`p-2.5 rounded-xl shrink-0 ${selectedIncident.risk === 'TINGGI' ? 'bg-red-500/20 text-red-500' : 'bg-amber-500/20 text-amber-500'}`}>
                 <ShieldAlert className="w-6 h-6" />
               </div>
               <div className="flex-1 min-w-0">
                 <h3 className="font-semibold text-lg text-slate-100 truncate pr-2">{selectedIncident.title}</h3>
                 <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">{selectedIncident.time} • {selectedIncident.distance}</p>
                 <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                   {selectedIncident.description} Resiko: <span className={`${selectedIncident.risk === 'TINGGI' ? 'text-red-500' : 'text-amber-500'} font-bold`}>{selectedIncident.risk}</span>.
                 </p>
                 <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                   <MapPin className="w-3.5 h-3.5" />
                   {selectedIncident.location}
                 </div>
                 <button suppressHydrationWarning className="mt-4 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-xl transition-colors text-sm font-semibold border border-slate-700/50">
                   Konfirmasi Detail
                 </button>
               </div>
             </div>
           </>
         )}
      </div>

      {/* FAB: REPORT INCIDENT */}
      <Link 
        href="/lapor"
        className={`pointer-events-auto absolute z-30 bottom-8 z-30 bg-teal-600 text-white rounded-full px-6 py-4 flex items-center gap-3 shadow-[0_0_20px_rgba(13,148,136,0.4)] hover:scale-105 hover:bg-teal-500 transition-all duration-500 group ${isSidebarOpen ? 'right-4 lg:right-[420px] xl:right-[470px]' : 'right-4 md:right-8'}`}
      >
        <AlertTriangle className="w-6 h-6 animate-pulse" />
        <span className="font-bold tracking-wide">REPORT INCIDENT</span>
      </Link>
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
              <Filter className="w-4 h-4 text-teal-500" />
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
                <select suppressHydrationWarning className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-xs">
                  <option>Hari Ini</option>
                  <option>7 Hari Terakhir</option>
                  <option>30 Hari Terakhir</option>
                </select>
              </div>

              {/* Lokasi Area */}
              <div>
                <label className="block text-[10px] font-bold tracking-wider text-slate-500 mb-1.5 uppercase">Lokasi Area</label>
                <select suppressHydrationWarning className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-xs">
                  <option>Semua Lokasi</option>
                  <option>Jakarta Timur</option>
                  <option>Depok</option>
                  <option>Bekasi</option>
                  <option>Jakarta Selatan</option>
                  <option>Jakarta Pusat</option>
                </select>
              </div>
            </div>
            
            {/* Status Verifikasi */}
            <div>
              <label className="block text-[10px] font-bold tracking-wider text-slate-500 mb-1.5 uppercase">Status Verifikasi</label>
              <select suppressHydrationWarning className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-xs">
                <option>Semua</option>
                <option>Terverifikasi Admin</option>
                <option>Menunggu Validasi</option>
              </select>
            </div>
            
            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-bold tracking-wider text-slate-500 uppercase">Radius Zona Merah</label>
                <span className="text-red-500 font-bold text-xs">{radius} km</span>
              </div>
              <input 
                suppressHydrationWarning
                type="range" 
                min="1" 
                max="15" 
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500 mb-3 block" 
              />
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
               Live Feed Laporan
             </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {isLoadingIncidents ? (
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
            ) : (
              filteredIncidents.map((feed) => (
                <div 
                  key={feed.id} 
                  className={`bg-slate-900 border ${selectedIncidentId === feed.id ? 'border-teal-500' : 'border-slate-800'} rounded-2xl p-4 hover:border-slate-700 transition-colors cursor-pointer group`}
                  onClick={() => {
                    setSelectedIncidentId(feed.id);
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                     <div className="flex gap-2">
                       <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded border bg-red-500/10 text-red-400 border-red-500/20">
                         Begal Fatal
                       </span>
                     </div>
                     <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-950 px-2 py-1 rounded border border-slate-800">
                       <Clock className="w-3 h-3" />
                       {feed.timeElapsed}
                     </div>
                  </div>
                  
                  <h4 className="font-bold text-slate-200 text-sm mb-1 group-hover:text-teal-400 transition-colors">{feed.title}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
                    <MapPin className="w-3.5 h-3.5" />
                    {feed.location}
                  </div>
  
                  <div className="flex items-center justify-between border-t border-slate-800/50 pt-3">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${feed.isVerified ? 'text-teal-500' : 'text-amber-500'}`}>
                       {feed.isVerified ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                       {feed.isVerified ? 'Terverifikasi' : 'Belum Verifikasi'}
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

