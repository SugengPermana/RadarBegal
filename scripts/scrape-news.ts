/**
 * Entry point scraper berita kriminal Jabodetabek.
 *
 * Usage:
 *   npm run scrape          # sekali + cron tiap 2 jam (daemon)
 *   npm run scrape:once     # sekali lalu exit
 *
 * Env (.env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   MAPBOX_ACCESS_TOKEN (opsional)
 *   SCRAPER_DEBUG=1
 */
import { loadScraperEnv } from "../scraper/lib/env";

loadScraperEnv();

void import("../scraper/index");
