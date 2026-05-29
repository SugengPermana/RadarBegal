"use client";

import Link from 'next/link';
import { AlertCircle, CheckCircle2, MapPin, X } from 'lucide-react';
import { BeritaBegal } from '@/types/begal';
import { formatTanggalIndonesia, formatWaktuIndonesia } from '@/lib/format';
import { normalizeRiskLevel, riskLabel } from '@/lib/risk';

interface MapNewsPopupProps {
  berita: BeritaBegal;
  onClose: () => void;
}

export function MapNewsPopup({ berita, onClose }: MapNewsPopupProps) {
  const risk = normalizeRiskLevel(berita.tingkat_risiko);
  const incidentDate = berita.incident_at || berita.published_at || berita.created_at;

  const riskIconClass =
    risk === 'CRITICAL'
      ? 'bg-red-500/20 text-red-500 border-red-500/30'
      : risk === 'WARNING'
        ? 'bg-orange-500/20 text-orange-500 border-orange-500/30'
        : 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 bottom-12 md:bottom-auto md:left-12 md:translate-x-0 md:top-1/2 md:-translate-y-1/2 w-[min(calc(100vw-4rem),18rem)] md:w-72 pointer-events-auto z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl p-4 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-slate-500 hover:text-slate-300 bg-slate-800/80 p-1 rounded-full"
          aria-label="Tutup"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-start gap-3 pr-6 mb-3">
          <div className={`p-2 rounded-xl border shrink-0 ${riskIconClass}`}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {riskLabel(berita.tingkat_risiko)}
            </p>
            <h3 className="font-bold text-sm text-slate-100 line-clamp-2 leading-snug">
              {berita.judul}
            </h3>
          </div>
        </div>

        <div className="space-y-1.5 text-xs text-slate-400 mb-3">
          <p>
            <span className="text-slate-500">Tanggal: </span>
            {formatTanggalIndonesia(incidentDate)}
          </p>
          <p>
            <span className="text-slate-500">Waktu: </span>
            {formatWaktuIndonesia(incidentDate)}
          </p>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
          {berita.isi_berita}
        </p>

        <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="truncate">{berita.lokasi}</span>
        </div>

        <div
          className={`flex items-center gap-1 text-xs font-semibold mb-3 ${berita.status_verifikasi === 'Terverifikasi' ? 'text-teal-500' : 'text-amber-500'
            }`}
        >
          {berita.status_verifikasi === 'Terverifikasi' ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          {berita.status_verifikasi}
        </div>

        <Link
          href={`/berita/${berita.id}`}
          className="block w-full text-center bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
        >
          Lihat Detail Selengkapnya
        </Link>
      </div>
    </div>
  );
}
