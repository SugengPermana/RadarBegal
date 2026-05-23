"use client";

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { BeritaBegal } from '@/types/begal';

export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get('q') || '';
  const rentang = searchParams.get('rentang') || 'Semua';
  const lokasi = searchParams.get('lokasi') || 'Semua Lokasi';
  const status = searchParams.get('status') || 'Semua';
  const risiko = searchParams.get('risiko') || 'Semua';
  const kategori = searchParams.get('kategori') || 'Semua';
  const id = searchParams.get('id');

  const setFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== 'Semua' && value !== 'Semua Lokasi') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const clearFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const applyFilters = useCallback(
    (data: BeritaBegal[]) => {
      return data.filter((item) => {
        // Search query (q)
        if (q && !item.judul.toLowerCase().includes(q.toLowerCase()) && !item.isi_berita?.toLowerCase().includes(q.toLowerCase())) {
          return false;
        }

        // Lokasi
        if (lokasi !== 'Semua Lokasi' && !item.lokasi.toLowerCase().includes(lokasi.toLowerCase())) {
          return false;
        }

        // Status
        if (status !== 'Semua' && item.status_verifikasi !== status) {
          return false;
        }

        // Kategori
        if (kategori !== 'Semua' && item.kategori !== kategori) {
          return false;
        }

        // Risiko
        if (risiko !== 'Semua' && item.tingkat_risiko !== risiko) {
          return false;
        }

        // Rentang Waktu
        if (rentang !== 'Semua') {
          const itemDate = new Date(item.created_at);
          const now = new Date();
          const diffTime = Math.abs(now.getTime() - itemDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (rentang === 'Hari Ini' && diffDays > 1) return false;
          if (rentang === '7 Hari Terakhir' && diffDays > 7) return false;
          if (rentang === '30 Hari Terakhir' && diffDays > 30) return false;
        }

        return true;
      });
    },
    [q, rentang, lokasi, status, risiko, kategori]
  );

  return {
    filters: { q, rentang, lokasi, status, risiko, kategori, id },
    setFilter,
    clearFilters,
    applyFilters,
  };
}
