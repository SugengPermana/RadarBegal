import { ShieldAlert, Lightbulb, Smartphone, ChevronRight, BookOpen } from "lucide-react";
import Link from "next/link";

export default function BeritaPage() {
  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col pt-20 md:pt-8 bg-slate-950 relative z-10">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-black text-slate-100 mb-3 tracking-tight">Berita Keamanan Terkini</h1>
        <p className="text-slate-400 text-lg">Informasi harian untuk kewaspadaan warga Jakarta.</p>
      </div>

      {/* Featured News / Hero */}
      <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-8 group cursor-pointer border border-slate-800 shadow-xl">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1555627685-611c0f059ab5?auto=format&fit=crop&q=80&w=1200')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
        
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col items-start">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-teal-500/20 text-teal-400 border border-teal-500/30 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              Info
            </span>
            <span className="text-slate-300 text-sm font-medium">2 Jam yang lalu</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Peningkatan Patroli Malam di Area Sudirman-Thamrin
          </h2>
          <p className="text-slate-300 text-base md:text-lg mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed max-w-3xl">
            Polda Metro Jaya mengumumkan peningkatan intensitas patroli berskala besar di sepanjang jalur protokol Sudirman-Thamrin mulai pukul 22:00 WIB. Langkah ini diambil sebagai respons atas laporan warga mengenai aktivitas mencurigakan...
          </p>
          <div className="flex items-center gap-2 text-teal-400 font-semibold hover:text-teal-300 transition-colors">
            Baca Selengkapnya
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Alert Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col hover:bg-slate-800/80 transition-colors shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-amber-500 flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
              <ShieldAlert className="w-4 h-4" /> Alert
            </span>
            <span className="text-slate-500 text-xs font-medium">4 Jam yang lalu</span>
          </div>
          <h3 className="text-xl font-bold text-slate-100 mb-3 leading-snug">Laporan Gangguan Lampu Jalan di Jakarta Selatan</h3>
          <p className="text-slate-400 text-sm mb-6 flex-1 leading-relaxed">
            Terpantau pemadaman PJU di sepanjang Jalan Antasari. Pengguna jalan diimbau ekstra hati-hati. Pemprov DKI sedang melakukan perbaikan darurat.
          </p>
          <Link href="/?id=2" className="self-start flex items-center gap-2 text-slate-300 bg-slate-950 border border-slate-800 px-4 py-2.5 rounded-lg hover:border-amber-500 hover:text-amber-500 transition-colors text-sm font-medium">
            <ShieldAlert className="w-4 h-4" /> Lihat Lokasi di Peta
          </Link>
        </div>

      </div>

      <div className="flex justify-center mt-12 mb-8">
        <button className="text-slate-300 bg-slate-900 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 px-8 py-3 rounded-full transition-all font-semibold shadow-sm">
          Muat Lebih Banyak
        </button>
      </div>

    </div>
  );
}
