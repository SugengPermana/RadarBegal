const BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

export function formatTanggalIndonesia(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '-';
  return `${d.getDate()} ${BULAN[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatWaktuIndonesia(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (Number.isNaN(d.getTime())) return '-';

  const hours = d.getHours();
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const h12 = hours % 12 || 12;
  const timeStr = `${h12.toString().padStart(2, '0')}.${minutes}`;

  let period: string;
  if (hours >= 5 && hours < 11) period = 'Pagi';
  else if (hours >= 11 && hours < 15) period = 'Siang';
  else if (hours >= 15 && hours < 18) period = 'Sore';
  else period = 'Malam';

  return `${timeStr} ${period}`;
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Baru saja';
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} hari yang lalu`;
}
