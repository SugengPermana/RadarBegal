import { getSupabaseAdmin } from "../../lib/supabase-admin";
import { logger } from "../../lib/logger";

export async function isDuplicate(
  title: string,
  sourceUrl: string,
): Promise<boolean> {
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedUrl = sourceUrl.trim().toLowerCase();

  const db = getSupabaseAdmin();
  const { data: byUrl, error: urlError } = await db
    .from("news")
    .select("id")
    .ilike("source_url", normalizedUrl)
    .limit(1)
    .maybeSingle();

  if (urlError) {
    logger.warn("Duplicate check (url) error", urlError.message);
  }
  if (byUrl) return true;

  const { data: byTitle, error: titleError } = await db
    .from("news")
    .select("id")
    .ilike("title", normalizedTitle)
    .limit(1)
    .maybeSingle();

  if (titleError) {
    logger.warn("Duplicate check (title) error", titleError.message);
  }

  return !!byTitle;
}
