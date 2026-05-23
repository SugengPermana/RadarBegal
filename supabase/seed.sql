-- Bersihkan tabel terlebih dahulu (opsional, jika ingin data fresh)
TRUNCATE TABLE public.incidents RESTART IDENTITY;

-- Insert data berita kejadian begal di Jakarta (2024-2026)
INSERT INTO public.incidents (title, time, time_elapsed, distance, description, risk, lat, lng, type, location, is_verified)
VALUES
(
  'Aksi Begal di Tanah Abang', 
  '03:15 AM', 
  '2 hours ago', 
  '4.2km dari Anda', 
  'Dilaporkan telah terjadi perampasan motor dan kekerasan oleh sekelompok begal bersenjata di kawasan Tanah Abang. Korban dilaporkan terluka.', 
  'TINGGI', 
  45, 
  40, 
  'Begal', 
  'Tanah Abang, Jakarta Pusat', 
  true
),
(
  'Peringatan Sindikat Senjata Rakitan', 
  '11:45 PM', 
  '5 hours ago', 
  '8.5km dari Anda', 
  'Polda Metro Jaya memperingatkan adanya sindikat begal dengan senjata api rakitan yang beroperasi di wilayah perbatasan Jakarta. Warga diminta waspada di malam hari.', 
  'TINGGI', 
  65, 
  60, 
  'Suspicious', 
  'Perbatasan Jakarta', 
  true
),
(
  'Percobaan Begal Digagalkan Warga', 
  '05:30 AM', 
  '1 day ago', 
  '3.1km dari Anda', 
  'Warga berhasil menggagalkan aksi percobaan begal di kawasan Kebayoran Lama. Pelaku sempat memepet korban sebelum diteriaki oleh warga sekitar.', 
  'SEDANG', 
  60, 
  45, 
  'Kriminal', 
  'Kebayoran Lama, Jakarta Selatan', 
  false
),
(
  'Komplotan Remaja Mencurigakan', 
  '01:20 AM', 
  '30 mins ago', 
  '12km dari Anda', 
  'CCTV menangkap gambar sekelompok remaja bermotor yang mondar-mandir di area minim penerangan sambil membawa senjata tajam (celurit).', 
  'SEDANG', 
  30, 
  70, 
  'Suspicious', 
  'Cakung, Jakarta Timur', 
  true
),
(
  'Jambret Ponsel Pejalan Kaki', 
  '08:00 PM', 
  '2 days ago', 
  '6.0km dari Anda', 
  'Seorang pelaku bermotor memepet pejalan kaki dan merampas ponsel di trotoar. Pelaku melarikan diri dengan kecepatan tinggi menembus lampu merah.', 
  'SEDANG', 
  40, 
  50, 
  'Jambret', 
  'Senen, Jakarta Pusat', 
  true
);
