import { getSupabaseAdmin } from "../../lib/supabase-admin";
import type { ParsedArticle } from "../../types/article";
import { toIso } from "../../lib/date";
import { logger } from "../../lib/logger";

export async function insertNews(article: ParsedArticle): Promise<boolean> {
  const { error } = await getSupabaseAdmin()
    .from("news")
    .insert({
      title: article.title,
      content: article.content,
      source_name: article.sourceName,
      source_url: article.sourceUrl,
      image_url: article.imageUrl,
      crime_type: article.crimeType,
      location_name: article.locationName,
      latitude: article.latitude,
      longitude: article.longitude,
      radius_meter: article.radiusMeter,
      risk_level: article.riskLevel,
      verification_status: article.verificationStatus,
      incident_at: toIso(article.incidentAt),
      published_at: toIso(article.publishedAt),
    });

  if (error) {
    logger.error(`Insert failed: ${article.title}`, error.message);
    return false;
  }

  logger.info(
    `✓ Inserted: ${article.title} [${article.riskLevel}] @ ${article.locationName}`,
  );
  return true;
}
