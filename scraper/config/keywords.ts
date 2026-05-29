/** Berita harus mengandung minimal satu keyword (title atau content) */
export const CRIME_KEYWORDS = [
  "begal",
  "jambret",
  "jambretan",
  "geng motor",
  "geng bermotor",
  "copet",
  "rampok",
  "perampasan",
  "pembegalan",
  "pejambretan",
  "begal motor",
  "tawuran motor",
  "komplotan motor",
  "razia begal",
  "aksi begal",
  "begal jalanan",
  "begal sadis",
] as const;

export const GANG_MOTOR_KEYWORDS = [
  "geng motor",
  "geng bermotor",
  "komplotan motor",
  "tawuran motor",
  "geng jalanan",
] as const;

export function isRelevantCrimeNews(text: string): boolean {
  const lower = text.toLowerCase();
  return CRIME_KEYWORDS.some((kw) => lower.includes(kw));
}

export function detectCrimeType(title: string, content: string): string {
  const text = `${title} ${content}`.toLowerCase();
  if (GANG_MOTOR_KEYWORDS.some((kw) => text.includes(kw))) return "Geng Motor";
  if (text.includes("jambret")) return "Jambret";
  return "Begal";
}
