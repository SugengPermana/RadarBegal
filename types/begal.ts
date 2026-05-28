export interface BeritaBegal {
  id: number;
  judul: string;
  isi_berita: string | null;
  latitude: number;
  longitude: number;
  radius_meter: number;
  lokasi: string;
  status_verifikasi: string;
  source_name?: string | null;
  source_url?: string | null;
  kategori: string;
  tingkat_risiko: string;
  image_url?: string | null;
  incident_at?: string | null;
  published_at?: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  role: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  newsId: number;
  title: string;
  location: string;
  riskLevel: string;
  publishedAt: string;
  read: boolean;
}
