import { BeritaBegal } from '@/types/begal';

export interface NewsRow {
  id: number;
  title: string;
  content: string;
  source_name: string | null;
  source_url: string | null;
  image_url: string | null;
  crime_type: string;
  location_name: string;
  latitude: number;
  longitude: number;
  radius_meter: number;
  risk_level: string;
  verification_status: string;
  incident_at: string | null;
  published_at: string | null;
  created_at: string;
}

export function mapNewsToBerita(row: NewsRow): BeritaBegal {
  return {
    id: row.id,
    judul: row.title,
    isi_berita: row.content,
    latitude: row.latitude,
    longitude: row.longitude,
    radius_meter: row.radius_meter,
    lokasi: row.location_name,
    status_verifikasi: row.verification_status,
    kategori: row.crime_type,
    tingkat_risiko: row.risk_level,
    image_url: row.image_url,
    incident_at: row.incident_at,
    published_at: row.published_at,
    created_at: row.created_at,
  };
}
