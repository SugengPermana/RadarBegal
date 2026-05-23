export interface BeritaBegal {
  id: number;
  judul: string;
  isi_berita: string | null;
  latitude: number;
  longitude: number;
  radius_meter: number;
  lokasi: string;
  status_verifikasi: string;
  kategori: string;
  tingkat_risiko: string;
  created_at: string;
}
