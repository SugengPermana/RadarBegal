"use client";

import { useState, useRef } from 'react';
import { MapPin, Camera, Target, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';
import { Toast } from '@/components/Toast';

export function ReportForm() {
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const withTimeout = async <T,>(
    promise: Promise<T>,
    ms: number,
    timeoutMessage: string
  ): Promise<T> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(timeoutMessage)), ms);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  };

  const [description, setDescription] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [incidentTime, setIncidentTime] = useState('');
  const [locationName, setLocationName] = useState('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!('geolocation' in navigator)) {
      setToast({ message: 'Geolokasi tidak didukung browser ini', type: 'error' });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoordinates({ lat, lng });
        if (!locationName) {
          setLocationName(`Lat ${lat.toFixed(5)}, Lng ${lng.toFixed(5)}`);
        }
        setIsLocating(false);
      },
      () => {
        setToast({ message: 'Gagal mengambil lokasi GPS', type: 'error' });
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedMime = ['image/jpeg', 'image/png'];
    if (!allowedMime.includes(file.type)) {
      setToast({ message: 'Foto hanya boleh JPG/JPEG/PNG', type: 'error' });
      setImageFile(null);
      setImagePreview(null);
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${user?.id}/${Date.now()}.${ext}`;

    const uploadRes = await withTimeout(
      supabase.storage.from('report-images').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      }),
      25_000,
      'Upload foto timeout'
    );

    const { error } = uploadRes;
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    const { data } = supabase.storage.from('report-images').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!coordinates) {
      setToast({ message: 'Ambil lokasi GPS terlebih dahulu', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const insertRes = await withTimeout(
        (async () => {
          return await supabase.from('reports').insert({
            description,
            incident_date: incidentDate,
            incident_time: incidentTime,
            location_name: locationName,
            latitude: coordinates.lat,
            longitude: coordinates.lng,
            image_url: imageUrl,
            user_id: user.id,
          });
        })(),
        25_000,
        'Kirim laporan timeout'
      );

      const { error } = insertRes;

      if (error) throw error;

      setToast({ message: 'Laporan berhasil dikirim', type: 'success' });
      setDescription('');
      setIncidentDate('');
      setIncidentTime('');
      setLocationName('');
      setCoordinates(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImageFile(null);
      setImagePreview(null);
      if (fileRef.current) fileRef.current.value = '';
    } catch (err) {
      console.error(err);
      setToast({ message: 'Gagal mengirim laporan. Coba lagi.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Deskripsi Kejadian
          </label>
          <textarea
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Jelaskan kejadian yang Anda saksikan..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-teal-500 outline-none resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tanggal</label>
            <input
              type="date"
              required
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-teal-500 outline-none color-scheme-dark"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Waktu</label>
            <input
              type="time"
              required
              value={incidentTime}
              onChange={(e) => setIncidentTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-teal-500 outline-none color-scheme-dark"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Nama Lokasi</label>
          <input
            type="text"
            required
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="Contoh: Sudirman, Jakarta"
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 focus:border-teal-500 outline-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lokasi GPS</label>
            <button
              type="button"
              onClick={handleGetLocation}
              disabled={isLocating}
              className="text-xs font-bold text-teal-500 hover:underline disabled:opacity-50"
            >
              {isLocating ? 'Mengambil...' : 'Ambil Lokasi Otomatis'}
            </button>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
            <MapPin className={`w-5 h-5 text-teal-500 ${isLocating ? 'animate-bounce' : ''}`} />
            <span className="text-sm text-slate-400">
              {coordinates
                ? `${coordinates.lat.toFixed(5)}, ${coordinates.lng.toFixed(5)}`
                : 'Belum ada koordinat'}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Foto Bukti</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpg,image/jpeg,image/png"
            className="hidden"
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="border-2 border-dashed border-slate-800 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-teal-500/50 transition-colors"
          >
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="Preview" className="max-h-40 rounded-xl object-cover" />
            ) : (
              <>
                <Camera className="w-8 h-8 text-slate-500" />
                <span className="text-sm text-slate-400">Ketuk untuk unggah foto</span>
              </>
            )}
          </button>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-teal-600 hover:bg-teal-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Mengirim...
            </>
          ) : (
            <>
              <Target className="w-5 h-5" />
              Kirim Laporan
            </>
          )}
        </button>
      </form>
    </>
  );
}
