"use client";

import { MapPin, Clock, ChevronLeft, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useBerita } from "@/providers/BeritaProvider";
import { formatTanggalIndonesia, formatWaktuIndonesia } from "@/lib/format";
import { normalizeRiskLevel, riskLabel } from "@/lib/risk";

export default function BeritaDetailPage() {
  const params = useParams();
  const beritaId = parseInt(params.id as string, 10);
  const { beritaData, isLoading } = useBerita();

  const berita = beritaData.find((b) => b.id === beritaId);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-slate-500 text-lg animate-pulse">Memuat berita...</div>
      </div>
    );
  }

  if (!berita) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen bg-slate-950 gap-4">
        <AlertCircle className="w-16 h-16 text-slate-700" />
        <h1 className="text-2xl font-bold text-slate-300">Berita Tidak Ditemukan</h1>
        <p className="text-slate-500">Berita dengan ID {beritaId} tidak tersedia.</p>
        <Link href="/berita" className="mt-4 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-500 transition-colors">
          Kembali ke Halaman Berita
        </Link>
      </div>
    );
  }

  const riskBadgeClass = berita.tingkat_risiko === 'CRITICAL' 
    ? 'bg-red-500/10 text-red-500 border-red-500/30' 
    : berita.tingkat_risiko === 'WARNING' 
    ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' 
    : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';

  return (
    <div className="flex-1 bg-slate-950 min-h-screen pt-20 md:pt-8">
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-16">

        {/* Back Navigation */}
        <Link href="/berita" className="inline-flex items-center gap-2 text-slate-400 hover:text-teal-400 transition-colors mb-8 text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Halaman Berita
        </Link>

        {/* Hero Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider uppercase border ${riskBadgeClass}`}>
              <AlertCircle className="w-3.5 h-3.5" />
              {riskLabel(berita.tingkat_risiko)} ({normalizeRiskLevel(berita.tingkat_risiko)})
            </span>
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${berita.status_verifikasi === 'Terverifikasi' ? 'text-teal-500' : 'text-amber-500'}`}>
              {berita.status_verifikasi === 'Terverifikasi' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
              {berita.status_verifikasi}
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-100 leading-tight mb-4">{berita.judul}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {formatTanggalIndonesia(berita.incident_at || berita.published_at || berita.created_at)}
              {' · '}
              {formatWaktuIndonesia(berita.incident_at || berita.published_at || berita.created_at)}
            </span>
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {berita.lokasi}</span>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-10 mb-8 shadow-lg">
          <p className="text-slate-200 text-lg leading-relaxed whitespace-pre-wrap">
            {berita.isi_berita || "Detail berita belum tersedia."}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="text-slate-500 text-[10px] font-bold tracking-wider uppercase mb-2">Lokasi</div>
            <div className="text-slate-200 font-semibold">{berita.lokasi}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="text-slate-500 text-[10px] font-bold tracking-wider uppercase mb-2">Radius</div>
            <div className="text-slate-200 font-semibold">{berita.radius_meter} meter</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="text-slate-500 text-[10px] font-bold tracking-wider uppercase mb-2">Sumber Berita</div>
            <div className="text-slate-200 font-semibold">{berita.source_name || "-"}</div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <div className="text-slate-500 text-[10px] font-bold tracking-wider uppercase mb-2">Source URL</div>
            <div className="text-slate-200 font-semibold text-sm">
              {berita.source_url ? (
                <a
                  href={berita.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-400 hover:text-teal-300 break-all underline underline-offset-2"
                >
                  {berita.source_url.replace(/^https?:\/\//, "")}
                </a>
              ) : (
                "-"
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href={`/?id=${berita.id}`}
            className="flex-1 bg-teal-600 text-white py-4 rounded-xl hover:bg-teal-500 transition-colors font-bold flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(13,148,136,0.3)] text-lg"
          >
            <MapPin className="w-5 h-5" />
            Lihat di Peta Maps
          </Link>
          <Link
            href="/kasus"
            className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 py-4 rounded-xl hover:bg-slate-800 hover:text-slate-100 transition-colors font-bold flex items-center justify-center gap-3 text-lg"
          >
            <ChevronLeft className="w-5 h-5" />
            Riwayat Kasus
          </Link>
        </div>
      </div>
    </div>
  );
}
