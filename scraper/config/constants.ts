/** Berita lebih tua dari ini tidak di-insert */
export const MAX_ARTICLE_AGE_DAYS = 30;

export const DEFAULT_VERIFICATION_STATUS = "Menunggu Validasi";

export const CRON_SCHEDULE = "0 */2 * * *";

export const RADIUS_BY_RISK: Record<string, number> = {
  CRITICAL: 700,
  WARNING: 500,
  CAUTION: 300,
};

/** Delay antar request HTTP (ms) — hormati rate limit portal & Nominatim */
export const HTTP_DELAY_MS = 800;

export const GEOCODE_DELAY_MS = 1100;

export const SCRAPER_USER_AGENT =
  "RadarBegalNewsBot/1.0 (+https://radarbegal.id; contact=admin@radarbegal.id)";
