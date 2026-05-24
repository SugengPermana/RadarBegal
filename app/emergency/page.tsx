import { PhoneCall, Siren, Flame, Waves, Landmark, Hospital, Navigation, Search, Phone, Map } from "lucide-react";

export default function EmergencyPage() {
  return (
    <div className="flex-1 p-4 md:p-8 max-w-[1200px] mx-auto w-full flex flex-col pt-20 md:pt-8 bg-slate-950 relative z-10">
      
      {/* Risk Indicator Head */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.6)]"></div>
          <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">Local Risk Level: <span className="text-amber-500">Elevated</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <Navigation className="w-4 h-4" />
          Jakarta Selatan
        </div>
      </div>

      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black text-slate-100 mb-2 tracking-tight">Emergency Call</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 w-full">
        
        {/* Left Column (Numbers) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            
            {/* 110 Police Card */}
            <a href="tel:110" className="group bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-800/80 hover:shadow-[0_0_30px_rgba(20,184,166,0.15)] transition-all duration-300 rounded-3xl p-6 md:p-8 text-left relative overflow-hidden h-48 sm:h-56 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-slate-950">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all duration-500"></div>
              <div className="flex justify-between items-start relative z-10 w-full">
                <div className="bg-slate-950 border border-slate-800 text-teal-400 p-3 md:p-4 rounded-2xl group-hover:bg-teal-500 group-hover:text-slate-900 transition-colors shadow-sm">
                  <Siren className="w-8 h-8 md:w-9 md:h-9" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-xs font-bold text-teal-400 flex items-center gap-1 hidden sm:flex">
                    <PhoneCall className="w-3 h-3" /> Panggil
                  </span>
                  <span className="font-bold tracking-wider text-xs bg-slate-950 text-slate-400 px-4 py-2 rounded-full border border-slate-800 uppercase group-hover:border-teal-500/50 shadow-sm">Polisi</span>
                </div>
              </div>
              <div className="relative z-10 mt-auto">
                <div className="text-5xl md:text-6xl font-black text-slate-100 group-hover:text-teal-400 transition-colors duration-300 mb-1 lg:mb-2 tracking-tight">110</div>
                <div className="text-slate-400 font-medium text-sm md:text-base">Bantuan Polisi Segera</div>
              </div>
            </a>

            {/* 118 Ambulans Card */}
            <a href="tel:118" className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/80 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300 rounded-3xl p-6 md:p-8 text-left relative overflow-hidden h-48 sm:h-56 flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-950">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
              <div className="flex justify-between items-start relative z-10 w-full">
                <div className="bg-slate-950 border border-slate-800 text-amber-500 p-3 md:p-4 rounded-2xl group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors shadow-sm">
                  <Hospital className="w-8 h-8 md:w-9 md:h-9" />
                </div>
                <div className="flex items-center gap-2">
                   <span className="opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-xs font-bold text-amber-500 flex items-center gap-1 hidden sm:flex">
                    <PhoneCall className="w-3 h-3" /> Panggil
                  </span>
                  <span className="font-bold tracking-wider text-xs bg-slate-950 text-slate-400 px-4 py-2 rounded-full border border-slate-800 uppercase group-hover:border-amber-500/50 shadow-sm">Ambulans</span>
                </div>
              </div>
              <div className="relative z-10 mt-auto">
                <div className="text-5xl md:text-6xl font-black text-slate-100 group-hover:text-amber-500 transition-colors duration-300 mb-1 lg:mb-2 tracking-tight">118</div>
                <div className="text-slate-400 font-medium text-sm md:text-base">Darurat Medis</div>
              </div>
            </a>

            {/* Smaller Secondary Cards */}
            <div className="md:col-span-2 grid grid-cols-2 gap-4 md:gap-6 mt-2">
              <a href="tel:113" className="bg-slate-900/40 border border-slate-800 hover:bg-slate-800/80 hover:border-red-500/40 transition-all duration-300 rounded-2xl p-4 md:p-5 flex items-center justify-between group cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-slate-950">
                <div className="flex items-center gap-4">
                  <div className="text-red-400 bg-slate-950 border border-slate-800 group-hover:border-red-500/30 p-3 rounded-xl transition-colors shadow-sm">
                    <Flame className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-3xl font-black text-slate-100 tracking-tight group-hover:text-red-400 transition-colors">113</div>
                    <div className="text-xs font-bold text-slate-500 tracking-wider uppercase mt-px">Damkar</div>
                  </div>
                </div>
                <PhoneCall className="w-5 h-5 text-slate-600 group-hover:text-red-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden sm:block" />
              </a>

              <a href="tel:115" className="bg-slate-900/40 border border-slate-800 hover:bg-slate-800/80 hover:border-blue-500/40 transition-all duration-300 rounded-2xl p-4 md:p-5 flex items-center justify-between group cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-950">
                <div className="flex items-center gap-4">
                  <div className="text-blue-400 bg-slate-950 border border-slate-800 group-hover:border-blue-500/30 p-3 rounded-xl transition-colors shadow-sm">
                    <Waves className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="flex flex-col">
                    <div className="text-3xl font-black text-slate-100 tracking-tight group-hover:text-blue-400 transition-colors">115</div>
                    <div className="text-xs font-bold text-slate-500 tracking-wider uppercase mt-px">Basarnas</div>
                  </div>
                </div>
                <PhoneCall className="w-5 h-5 text-slate-600 group-hover:text-blue-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 hidden sm:block" />
              </a>
            </div>
          </div>
          
          {/* Regional Directory Section */}
          <div className="mt-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black text-slate-100 tracking-tight">Regional Directory</h2>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Cari area atau fasilitas..." 
                  className="bg-slate-900 border border-slate-800 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all w-full sm:w-72 shadow-sm placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Active Region: Jakarta */}
              <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 shadow-sm transition-all hover:border-slate-700/50">
                <div className="px-6 py-4 bg-slate-800/30 border-b border-slate-800 flex justify-between items-center">
                  <span className="font-bold text-slate-100 flex items-center gap-2"><Map className="w-4 h-4 text-teal-500" /> DKI Jakarta</span>
                  <span className="text-xs font-bold text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">12 Fasilitas</span>
                </div>
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="group bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-teal-500/40 transition-colors flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="font-bold text-slate-200 text-lg mb-1 group-hover:text-teal-400 transition-colors">Polda Metro Jaya</div>
                        <div className="text-slate-500 text-sm font-medium">Markas Besar Polisi</div>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 group-hover:border-teal-500/30 transition-colors">
                        <Landmark className="w-5 h-5 text-slate-400 group-hover:text-teal-400 transition-colors" />
                      </div>
                    </div>
                    <a href="tel:0215234000" className="w-full flex items-center justify-center gap-2 font-bold text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 py-3 rounded-xl transition-colors border border-teal-500/20 focus:outline-none focus:ring-2 focus:ring-teal-500 mt-2">
                      <Phone className="w-4 h-4" /> Hubungi: 021-5234000
                    </a>
                  </div>
                  
                  <div className="group bg-slate-950 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-colors flex flex-col justify-between h-full">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <div className="font-bold text-slate-200 text-lg mb-1 group-hover:text-amber-500 transition-colors">RSUPN Cipto M.</div>
                        <div className="text-slate-500 text-sm font-medium">Rumah Sakit (IGD)</div>
                      </div>
                      <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 group-hover:border-amber-500/30 transition-colors">
                        <Hospital className="w-5 h-5 text-slate-400 group-hover:text-amber-500 transition-colors" />
                      </div>
                    </div>
                    <a href="tel:0211500135" className="w-full flex items-center justify-center gap-2 font-bold text-amber-500 bg-amber-500/10 hover:bg-amber-500/20 py-3 rounded-xl transition-colors border border-amber-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500 mt-2">
                      <Phone className="w-4 h-4" /> Hubungi: 021-1500135
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Map / Facilities) */}
        <div className="lg:col-span-5 hidden lg:flex flex-col relative h-[calc(100vh-140px)] sticky top-24">
          <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative shadow-lg flex flex-col items-center justify-center group cursor-pointer hover:border-slate-700 transition-colors">
             <div 
              className="absolute inset-0 opacity-40 mix-blend-luminosity grayscale group-hover:grayscale-0 group-hover:opacity-60 transition-all duration-700"
              style={{
                backgroundImage: `url("https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=2000&auto=format&fit=crop")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            
            {/* Map Placeholder Content */}
            <div className="relative z-10 flex flex-col items-center p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-slate-900/80 border border-slate-700 flex items-center justify-center mb-6 backdrop-blur-md group-hover:scale-110 group-hover:border-teal-500/50 transition-all duration-500 shadow-2xl">
                 <Navigation className="w-8 h-8 text-teal-500 opacity-90 group-hover:animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-slate-100 mb-2">Peta Fasilitas Interaktif</h3>
              <p className="text-slate-400 font-medium max-w-[250px] text-sm">Ketuk untuk membuka peta layar penuh dan rute navigasi terdekat.</p>
            </div>
            
            {/* Floating Panel on Map */}
            <div className="absolute bottom-6 left-6 right-6 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 shadow-2xl transition-transform duration-500 group-hover:-translate-y-2">
               <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase flex items-center gap-2 mb-4">
                  <Search className="w-3.5 h-3.5" /> Fasilitas Terdekat (Radius 2km)
               </div>
               <div className="space-y-3">
                 <div className="bg-slate-950 border border-slate-800 hover:border-teal-500/30 transition-colors rounded-xl p-3 flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                      <div className="w-1.5 h-10 bg-teal-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.4)]"></div>
                      <div>
                        <p className="font-bold text-slate-200">Polres Metro Jaksel</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">1.2 km dari Anda • Buka 24 Jam</p>
                      </div>
                    </div>
                    <a href="tel:02172796244" className="bg-slate-900 hover:bg-teal-500/20 border border-slate-800 hover:border-teal-500/50 text-teal-400 p-3 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500">
                      <PhoneCall className="w-4 h-4" />
                    </a>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
