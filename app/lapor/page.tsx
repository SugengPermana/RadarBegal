"use client";

import { useState } from "react";
import { MapPin, Camera, Image as ImageIcon, CheckCircle, Map, Target, AlertTriangle } from "lucide-react";

export default function LaporPage() {
  const [formState, setFormState] = useState<"IDLE" | "PROCESSING" | "SUCCESS">("IDLE");
  const [resetKey, setResetKey] = useState(0);
  const [isLocating, setIsLocating] = useState(false);
  const [locationText, setLocationText] = useState("Pilih lokasi atau ketuk Gunakan GPS");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("PROCESSING");
    
    // Simulate AI processing
    setTimeout(() => {
      setFormState("SUCCESS");
    }, 2500);
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationText("Mencari kordinat lokasi...");
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          setLocationText(`Lat: ${position.coords.latitude.toFixed(5)}, Lng: ${position.coords.longitude.toFixed(5)}`);
        },
        (error) => {
          setIsLocating(false);
          setLocationText("Gagal mengakses lokasi (Akses ditolak)");
        }
      );
    } else {
      setIsLocating(false);
      setLocationText("Geolokasi tidak didukung pada browser ini");
    }
  };

  if (formState === "PROCESSING") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 animate-in fade-in duration-500">
        <div className="relative w-32 h-32 flex items-center justify-center mb-8">
          <div className="absolute inset-0 rounded-full border-2 border-teal-500/20 animate-ping"></div>
          <div className="absolute inset-4 rounded-full border-2 border-teal-500/40 animate-ping" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center z-10 border border-slate-800 overlay shadow-[0_0_30px_rgba(20,184,166,0.3)]">
            <Target className="w-8 h-8 text-teal-400" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-100 mb-3 text-center">AI Sedang Menganalisis</h2>
        <p className="text-slate-400 text-center max-w-xs leading-relaxed">
          Memverifikasi lokasi, mengklasifikasi tingkat ancaman, dan menyusun peringatan siaga...
        </p>
      </div>
    );
  }

  if (formState === "SUCCESS") {
    return (
      <div className="flex-1 flex flex-col p-6 pt-12 animate-in slide-in-from-bottom-8 duration-500">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mb-5 border border-teal-500/20 shadow-[0_0_40px_rgba(20,184,166,0.15)]">
            <CheckCircle className="w-10 h-10 text-teal-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-100 mb-2">Laporan Diterima</h2>
          <p className="text-slate-400 px-4">Terima kasih atas kewaspadaan Anda. Peringatan telah didistribusikan.</p>
        </div>

        {/* AI Summary Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg mb-6 relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500"></div>
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
            <h3 className="font-bold text-lg text-slate-200">Ringkasan AI: Resiko Tinggi</h3>
          </div>
          <p className="text-slate-400 text-sm leading-relaxed mb-5">
            Berdasarkan laporan Anda, pola kejadian ini teridentifikasi sebagai <strong className="text-slate-200 font-semibold">Tindak Kriminal</strong> di koordinat ini. Radius peringatan diatur ke 2KM.
          </p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">#Kriminal</span>
            <span className="bg-slate-950 border border-slate-800 text-slate-300 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">#Sudirman</span>
            <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">Level: Waspada</span>
          </div>
        </div>

        <button 
          onClick={() => {
            setFormState("IDLE");
            setResetKey(prev => prev + 1);
          }}
          className="mt-4 w-full bg-teal-600 hover:bg-teal-500 text-white shadow-[0_0_20px_rgba(13,148,136,0.3)] font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          Kirim Laporan Lain
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-4 w-full bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold py-4 rounded-xl border border-slate-800 transition-colors flex items-center justify-center gap-2"
        >
          <Map className="w-5 h-5" />
          Kembali ke Peta Utama
        </button>
      </div>
    );
  }

  // IDLE Form State
  return (
    <div className="flex-1 flex flex-col gap-6 p-4 md:p-6 animate-in fade-in duration-300">
      <p className="text-slate-400 text-center mb-2 px-4 leading-relaxed">
        Berikan detail kejadian untuk memperingatkan pengguna lain di area ini.
      </p>

      <form key={resetKey} onSubmit={handleSubmit} className="flex flex-col gap-6">
        
        {/* Jenis Kejadian */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Jenis Kejadian</label>
          <select required className="w-full appearance-none bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all cursor-pointer">
            <option value="" disabled selected>Pilih kategori insiden...</option>
            <option value="kriminal">Tindak Kriminal (Maling, Begal)</option>
            <option value="kecelakaan">Kecelakaan Lalu Lintas</option>
            <option value="infrastruktur">Kerusakan Infrastruktur Bahaya</option>
            <option value="lainnya">Lainnya</option>
          </select>
        </div>

        {/* Waktu */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Tanggal</label>
            <input type="date" required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none color-scheme-dark" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Waktu</label>
            <input type="time" required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none color-scheme-dark" />
          </div>
        </div>

        {/* Lokasi Picker Simulation */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-end pl-1 mb-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lokasi Kejadian</label>
            <button 
              type="button" 
              onClick={handleGetLocation} 
              disabled={isLocating}
              className="text-xs font-bold text-teal-500 cursor-pointer hover:underline uppercase disabled:opacity-50"
            >
              Gunakan GPS
            </button>
          </div>
          <div className="relative h-48 rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 flex flex-col items-center justify-center group cursor-crosshair">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            
            <div className="relative z-10 flex flex-col items-center drop-shadow-2xl">
              <MapPin className={`w-8 h-8 text-teal-500 drop-shadow-[0_0_8px_rgba(20,184,166,0.8)] ${isLocating ? 'animate-bounce' : ''}`} />
              <div className="w-2 h-2 bg-slate-400 rounded-full mt-1 opacity-50"></div>
            </div>
            
            <div className="absolute bottom-3 pb-1 border-b border-transparent group-hover:border-slate-600 transition-colors px-4 text-center">
              <p className="text-xs text-slate-400 font-medium">{locationText}</p>
            </div>
          </div>
        </div>

        {/* Deskripsi */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Detail Insiden</label>
          <textarea 
            required
            rows={4} 
            placeholder="Jelaskan apa yang terjadi, ciri-ciri pelaku, atau plat nomor kendaraan jika ada..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 outline-none transition-all resize-none placeholder:text-slate-600"
          ></textarea>
        </div>

        {/* Upload Foto */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Foto Bukti (Opsional)</label>
          <div className="border-2 border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-slate-900/50 hover:bg-slate-900 transition-colors cursor-pointer group">
            <div className="w-14 h-14 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 group-hover:border-teal-500/50 group-hover:text-teal-400 transition-colors text-slate-500">
              <Camera className="w-6 h-6" />
            </div>
            <p className="font-semibold text-slate-300">Ketuk untuk unggah foto</p>
            <p className="text-sm text-slate-500 mt-2 font-medium">Maks. 3 foto (JPG, PNG)</p>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 mt-2 border-t border-slate-800/50">
          <button 
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-500 text-white shadow-[0_0_20px_rgba(13,148,136,0.3)] font-bold text-lg py-4 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Target className="w-5 h-5" />
            Kirim Laporan Keamanan
          </button>
          <p className="text-center text-xs text-slate-600 mt-4 font-medium px-4">
            Penyalahgunaan sistem dapat dikenakan pasal UU ITE.
          </p>
        </div>

      </form>
    </div>
  );
}
