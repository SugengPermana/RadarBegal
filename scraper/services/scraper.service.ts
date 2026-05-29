import { SOURCES } from "../config/sources";
import { DEFAULT_VERIFICATION_STATUS } from "../config/constants";
import { isRelevantCrimeNews, detectCrimeType } from "../config/keywords";
import type { RawArticle, ScraperRunStats } from "../types/article";
import { isWithinMaxAge } from "../lib/date";
import { logger } from "../lib/logger";
import { parseSource, enrichArticleContent } from "../modules/parser";
import { extractLocationFromText } from "../modules/location/location.extractor";
import { geocodeLocation } from "../modules/geocoder";
import { analyzeRiskLevel, radiusForRisk } from "../modules/risk/risk.analyzer";
import { isDuplicate } from "../modules/duplicate/duplicate.checker";
import { insertNews } from "../modules/repository/news.repository";
import type { NewsSourceConfig } from "../types/article";

function emptyStats(): ScraperRunStats {
  return {
    sourcesProcessed: 0,
    candidatesFound: 0,
    inserted: 0,
    skippedDuplicate: 0,
    skippedIrrelevant: 0,
    skippedOld: 0,
    skippedNoLocation: 0,
    skippedGeocode: 0,
    errors: 0,
  };
}

async function processArticle(
  raw: RawArticle,
  stats: ScraperRunStats,
): Promise<void> {
  stats.candidatesFound++;

  const searchText = `${raw.title} ${raw.content}`;
  if (!isRelevantCrimeNews(searchText)) {
    stats.skippedIrrelevant++;
    logger.debug(`Skip irrelevant: ${raw.title}`);
    return;
  }

  if (!isWithinMaxAge(raw.publishedAt)) {
    stats.skippedOld++;
    logger.debug(`Skip old: ${raw.title}`);
    return;
  }

  const enriched = await enrichArticleContent(raw);
  const fullText = `${enriched.title} ${enriched.content}`;

  const location = extractLocationFromText(enriched.title, enriched.content);
  if (!location) {
    stats.skippedNoLocation++;
    logger.debug(`Skip no location: ${enriched.title}`);
    return;
  }

  const geo = await geocodeLocation(location.geocodeQuery);
  if (!geo) {
    stats.skippedGeocode++;
    logger.warn(
      `Skip geocode fail: ${enriched.title} (${location.geocodeQuery})`,
    );
    return;
  }

  if (await isDuplicate(enriched.title, enriched.sourceUrl)) {
    stats.skippedDuplicate++;
    logger.debug(`Skip duplicate: ${enriched.title}`);
    return;
  }

  const riskLevel = analyzeRiskLevel(enriched.title, enriched.content);
  const crimeType = detectCrimeType(enriched.title, enriched.content);

  const parsed = {
    ...enriched,
    crimeType,
    locationName: location.locationName,
    latitude: geo.latitude,
    longitude: geo.longitude,
    radiusMeter: radiusForRisk(riskLevel),
    riskLevel,
    verificationStatus: DEFAULT_VERIFICATION_STATUS,
    incidentAt: enriched.publishedAt,
  };

  const ok = await insertNews(parsed);
  if (ok) {
    stats.inserted++;
  } else {
    stats.errors++;
  }
}

async function scrapeSource(
  source: NewsSourceConfig,
  stats: ScraperRunStats,
): Promise<void> {
  try {
    logger.info(`── Source: ${source.name} (${source.id}) [${source.type}]`);
    const articles = await parseSource(source);
    stats.sourcesProcessed++;

    for (const article of articles) {
      try {
        await processArticle(article, stats);
      } catch (err) {
        stats.errors++;
        logger.error(`Article error: ${article.title}`, err);
      }
    }
  } catch (err) {
    stats.errors++;
    logger.error(`Source failed: ${source.id}`, err);
  }
}

export async function runScraper(): Promise<ScraperRunStats> {
  const stats = emptyStats();
  const started = Date.now();

  logger.info("═══════════════════════════════════════════");
  logger.info("RadarBegal Scraper — Jabodetabek Multi-Source");
  logger.info(`Sources: ${SOURCES.length} | Max age: 30 days`);
  logger.info("═══════════════════════════════════════════");

  for (const source of SOURCES) {
    await scrapeSource(source, stats);
  }

  const elapsed = ((Date.now() - started) / 1000).toFixed(1);
  logger.info("───────────────────────────────────────────");
  logger.info("Scraper run complete", {
    elapsedSec: elapsed,
    ...stats,
  });
  logger.info("───────────────────────────────────────────");

  return stats;
}
