"use client";

import { ShieldAlert, MapPin, Clock, ChevronRight, Search, X, Filter, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect,useState, Suspense } from "react";
import { useBerita } from "@/providers/BeritaProvider";
import { useFilters } from "@/hooks/useFilters";

export default function BeritaPage() {
  return (
    <Suspense fallback={<div className="flex-1 flex items-center justify-center"><div className="text-slate-500 animate-pulse">Loading...</div></div>}>
      <BeritaContent />
    </Suspense>
  );
}

function BeritaContent() {
  const { beritaData, isLoading } = useBerita();
  const { filters, setFilter, applyFilters } = useFilters();
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  const filteredBerita = applyFilters(beritaData);
  const heroBerita = filteredBerita[0];
  const restBerita = filteredBerita.slice(1);
  const [searchInput, setSearchInput] = useState(filters.q || "");

  useEffect(() => {
    const timer = setTimeout(() => {
      setFilter("q", searchInput);
    }, 400);
  
    return () => clearTimeout(timer);
  }, [searchInput, setFilter]);
  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col pt-20 md:pt-8 bg-slate-950 relative z-10">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-slate-100 mb-3 tracking-tight">Informasi Berita Terkini</h1>
        <p className="text-slate-400 text-lg">Berita harian kewaspadaan terhadap begal untuk Masyarakat Jabodetabek</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 relative">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-teal-400 transition-colors" />
          <input
            type="text"
            placeholder="Cari berita..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-xl py-3 pl-12 pr-10 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-500 shadow-sm"
          />
          {searchInput && (
            <button onClick={() => {
              setSearchInput("");
              setFilter("q", "");
            }} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilterPanel(!showFilterPanel)}
          className={`bg-slate-900 border ${showFilterPanel ? 'border-teal-500 text-teal-400' : 'border-slate-800 text-slate-300'} px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors font-medium shadow-sm whitespace-nowrap`}
        >
          <Filter className="w-5 h-5" />
          Filter
        </button>

        {/* Filter Dropdown */}
        {showFilterPanel && (
          <div className="absolute top-[110%] right-0 w-72 md:w-80 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl z-20 animate-in fade-in slide-in-from-top-2 flex flex-col gap-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-1 shrink-0">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm"><Filter className="w-4 h-4 text-teal-500" /> Filter Berita</h3>
              <button onClick={() => setShowFilterPanel(false)} className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-full hover:bg-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase">Tingkat Risiko</label>
              <select value={filters.risiko} onChange={(e) => setFilter('risiko', e.target.value)} suppressHydrationWarning className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-sm">
                <option>Semua</option>
                <option>CRITICAL</option>
                <option>WARNING</option>
                <option>CAUTION</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase">Rentang Waktu</label>
              <select value={filters.rentang} onChange={(e) => setFilter('rentang', e.target.value)} suppressHydrationWarning className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-sm">
                <option>Semua</option>
                <option>Hari Ini</option>
                <option>7 Hari Terakhir</option>
                <option>30 Hari Terakhir</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold tracking-wider text-slate-500 mb-2 uppercase">Status Verifikasi</label>
              <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} suppressHydrationWarning className="w-full bg-slate-950 border border-slate-800 text-slate-300 rounded-lg px-3 py-2 border-r-[8px] border-r-transparent focus:outline-none focus:border-teal-500 text-sm">
                <option>Semua</option>
                <option>Terverifikasi</option>
                <option>Belum Terverifikasi</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-slate-500">Memuat berita...</div>
      ) : filteredBerita.length === 0 ? (
        <div className="text-center py-12 text-slate-500">Belum ada berita sesuai filter.</div>
      ) : (
        <>
          {/* Link untuk Masuk berita detail*/}
          {heroBerita && (
            <Link href={`/berita/${heroBerita.id}`} className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-8 group cursor-pointer border border-slate-800 shadow-xl block">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>

              <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col items-start">
                <div className="flex items-center gap-4 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${heroBerita.tingkat_risiko === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/30' : heroBerita.tingkat_risiko === 'WARNING' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'}`}>
                    {heroBerita.kategori} — {heroBerita.tingkat_risiko}
                  </span>
                  <span className="text-slate-300 text-sm font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(heroBerita.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  {heroBerita.judul}
                </h2>
                <p className="text-slate-300 text-base md:text-lg mb-4 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-3xl">
                  {heroBerita.isi_berita}
                </p>
                <div className="flex items-center gap-4 mb-4">
                  <span className="flex items-center gap-1 text-slate-400 text-sm"><MapPin className="w-4 h-4" /> {heroBerita.lokasi}</span>
                  <span className={`flex items-center gap-1 text-sm font-semibold ${heroBerita.status_verifikasi === 'Terverifikasi' ? 'text-teal-500' : 'text-amber-500'}`}>
                    {heroBerita.status_verifikasi === 'Terverifikasi' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {heroBerita.status_verifikasi}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-teal-400 font-semibold hover:text-teal-300 transition-colors">
                  Baca Selengkapnya
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          )}

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restBerita.map((berita) => (
              <div key={berita.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col hover:bg-slate-800/80 transition-colors shadow-sm relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-full h-1 ${berita.tingkat_risiko === 'CRITICAL' ? 'bg-red-500' : berita.tingkat_risiko === 'WARNING' ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                <div className="flex justify-between items-center mb-4">
                  <span className={`flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase ${berita.tingkat_risiko === 'CRITICAL' ? 'text-red-500' : berita.tingkat_risiko === 'WARNING' ? 'text-orange-500' : 'text-yellow-500'}`}>
                    <ShieldAlert className="w-4 h-4" /> {berita.kategori}
                  </span>
                  <span className="text-slate-500 text-xs font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(berita.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3 leading-snug group-hover:text-teal-400 transition-colors line-clamp-2">{berita.judul}</h3>
                <p className="text-slate-400 text-sm mb-4 flex-1 leading-relaxed line-clamp-3">
                  {berita.isi_berita}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  {berita.lokasi}
                </div>
                <div className="flex items-center justify-between border-t border-slate-800 pt-4">
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${berita.status_verifikasi === 'Terverifikasi' ? 'text-teal-500' : 'text-amber-500'}`}>
                    {berita.status_verifikasi === 'Terverifikasi' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    {berita.status_verifikasi}
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Link href={`/?id=${berita.id}`} className="flex-1 flex items-center justify-center gap-2 text-slate-300 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg hover:border-teal-500 hover:text-teal-400 transition-colors text-sm font-medium">
                    <MapPin className="w-4 h-4" /> Lihat di Peta
                  </Link>
                  <Link href={`/berita/${berita.id}`} className="flex-1 flex items-center justify-center gap-2 text-slate-300 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg hover:border-teal-500 hover:text-teal-400 transition-colors text-sm font-medium">
                    Detail <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
