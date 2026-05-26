/**
 * Area Jabodetabek untuk deteksi lokasi dari teks berita.
 * Urutan: nama lebih panjang / spesifik didahulukan saat matching.
 */
export const JABODETABEK_AREAS: { name: string; geocodeQuery: string }[] = [
  // Jakarta detail
  { name: 'Jakarta Pusat', geocodeQuery: 'Jakarta Pusat, DKI Jakarta, Indonesia' },
  { name: 'Jakarta Selatan', geocodeQuery: 'Jakarta Selatan, DKI Jakarta, Indonesia' },
  { name: 'Jakarta Timur', geocodeQuery: 'Jakarta Timur, DKI Jakarta, Indonesia' },
  { name: 'Jakarta Barat', geocodeQuery: 'Jakarta Barat, DKI Jakarta, Indonesia' },
  { name: 'Jakarta Utara', geocodeQuery: 'Jakarta Utara, DKI Jakarta, Indonesia' },
  { name: 'Tanah Abang', geocodeQuery: 'Tanah Abang, Jakarta Pusat, Indonesia' },
  { name: 'Kemang', geocodeQuery: 'Kemang, Jakarta Selatan, Indonesia' },
  { name: 'Sudirman', geocodeQuery: 'Sudirman, Jakarta Pusat, Indonesia' },
  { name: 'Menteng', geocodeQuery: 'Menteng, Jakarta Pusat, Indonesia' },
  { name: 'Cilandak', geocodeQuery: 'Cilandak, Jakarta Selatan, Indonesia' },
  { name: 'Pasar Minggu', geocodeQuery: 'Pasar Minggu, Jakarta Selatan, Indonesia' },
  { name: 'Cengkareng', geocodeQuery: 'Cengkareng, Jakarta Barat, Indonesia' },
  { name: 'Kalideres', geocodeQuery: 'Kalideres, Jakarta Barat, Indonesia' },
  { name: 'Pulogadung', geocodeQuery: 'Pulogadung, Jakarta Timur, Indonesia' },
  { name: 'Cakung', geocodeQuery: 'Cakung, Jakarta Timur, Indonesia' },
  { name: 'Matraman', geocodeQuery: 'Matraman, Jakarta Timur, Indonesia' },
  { name: 'Koja', geocodeQuery: 'Koja, Jakarta Utara, Indonesia' },
  { name: 'Kelapa Gading', geocodeQuery: 'Kelapa Gading, Jakarta Utara, Indonesia' },
  { name: 'Pluit', geocodeQuery: 'Pluit, Jakarta Utara, Indonesia' },
  { name: 'Pancoran', geocodeQuery: 'Pancoran, Jakarta Selatan, Indonesia' },
  { name: 'Blok M', geocodeQuery: 'Blok M, Jakarta Selatan, Indonesia' },
  { name: 'Senayan', geocodeQuery: 'Senayan, Jakarta Pusat, Indonesia' },
  { name: 'Kuningan', geocodeQuery: 'Kuningan, Jakarta Selatan, Indonesia' },
  { name: 'Mampang', geocodeQuery: 'Mampang, Jakarta Selatan, Indonesia' },
  { name: 'Pondok Indah', geocodeQuery: 'Pondok Indah, Jakarta Selatan, Indonesia' },
  { name: 'Ciputat', geocodeQuery: 'Ciputat, Tangerang Selatan, Indonesia' },
  { name: 'Cibubur', geocodeQuery: 'Cibubur, Jakarta Timur, Indonesia' },
  { name: 'Bekasi', geocodeQuery: 'Bekasi, Jawa Barat, Indonesia' },
  { name: 'Bekasi Timur', geocodeQuery: 'Bekasi Timur, Bekasi, Indonesia' },
  { name: 'Bekasi Barat', geocodeQuery: 'Bekasi Barat, Bekasi, Indonesia' },
  { name: 'Harapan Indah', geocodeQuery: 'Harapan Indah, Bekasi, Indonesia' },
  { name: 'Depok', geocodeQuery: 'Depok, Jawa Barat, Indonesia' },
  { name: 'Sawangan', geocodeQuery: 'Sawangan, Depok, Indonesia' },
  { name: 'Margonda', geocodeQuery: 'Margonda, Depok, Indonesia' },
  { name: 'Bogor', geocodeQuery: 'Bogor, Jawa Barat, Indonesia' },
  { name: 'Bogor Timur', geocodeQuery: 'Bogor Timur, Bogor, Indonesia' },
  { name: 'Cibinong', geocodeQuery: 'Cibinong, Bogor, Indonesia' },
  { name: 'Tangerang', geocodeQuery: 'Tangerang, Banten, Indonesia' },
  { name: 'Tangerang Selatan', geocodeQuery: 'Tangerang Selatan, Banten, Indonesia' },
  { name: 'BSD', geocodeQuery: 'BSD City, Tangerang Selatan, Indonesia' },
  { name: 'Serpong', geocodeQuery: 'Serpong, Tangerang Selatan, Indonesia' },
  { name: 'Alam Sutera', geocodeQuery: 'Alam Sutera, Tangerang Selatan, Indonesia' },
  { name: 'Karawaci', geocodeQuery: 'Karawaci, Tangerang, Indonesia' },
  { name: 'Cikarang', geocodeQuery: 'Cikarang, Bekasi, Indonesia' },
  { name: 'Cileungsi', geocodeQuery: 'Cileungsi, Bogor, Indonesia' },
  { name: 'Kemayoran', geocodeQuery: 'Kemayoran, Jakarta Pusat, Indonesia' },
  { name: 'Jakarta', geocodeQuery: 'Jakarta, DKI Jakarta, Indonesia' },
];

/** Bounding box kasar Jabodetabek untuk validasi hasil geocode */
export const JABODETABEK_BOUNDS = {
  minLat: -6.55,
  maxLat: -6.05,
  minLng: 106.35,
  maxLng: 107.15,
};

export function isWithinJabodetabek(lat: number, lng: number): boolean {
  return (
    lat >= JABODETABEK_BOUNDS.minLat &&
    lat <= JABODETABEK_BOUNDS.maxLat &&
    lng >= JABODETABEK_BOUNDS.minLng &&
    lng <= JABODETABEK_BOUNDS.maxLng
  );
}
