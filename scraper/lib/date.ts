import { MAX_ARTICLE_AGE_DAYS } from '../config/constants';

export function parseArticleDate(raw: string | undefined | null): Date | null {
  if (!raw?.trim()) return null;

  const d = new Date(raw);
  if (!Number.isNaN(d.getTime())) return d;

  // Format Indonesia umum: "26 Mei 2026, 14:30"
  const idMonths: Record<string, number> = {
    januari: 0,
    februari: 1,
    maret: 2,
    april: 3,
    mei: 4,
    juni: 5,
    juli: 6,
    agustus: 7,
    september: 8,
    oktober: 9,
    november: 10,
    desember: 11,
  };

  const match = raw.toLowerCase().match(
    /(\d{1,2})\s+(\w+)\s+(\d{4})(?:[,\s]+(\d{1,2})[.:](\d{2}))?/
  );
  if (match) {
    const day = parseInt(match[1], 10);
    const month = idMonths[match[2]];
    const year = parseInt(match[3], 10);
    if (month !== undefined) {
      const hour = match[4] ? parseInt(match[4], 10) : 12;
      const min = match[5] ? parseInt(match[5], 10) : 0;
      return new Date(year, month, day, hour, min);
    }
  }

  return null;
}

export function isWithinMaxAge(date: Date, maxDays = MAX_ARTICLE_AGE_DAYS): boolean {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - maxDays);
  return date >= cutoff && date <= new Date();
}

export function toIso(date: Date): string {
  return date.toISOString();
}
