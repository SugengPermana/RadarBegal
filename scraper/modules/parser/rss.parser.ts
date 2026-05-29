import * as cheerio from "cheerio";
import type { NewsSourceConfig, RawArticle } from "../../types/article";
import { fetchWithRetry } from "../../lib/http";
import { parseArticleDate } from "../../lib/date";
import { logger } from "../../lib/logger";

function stripCdata(value: string): string {
  return value
    .replace(/^<!\[CDATA\[/, "")
    .replace(/\]\]>$/, "")
    .trim();
}

function cleanHtmlToText(html: string): string {
  if (!html) return "";
  const $ = cheerio.load(html);
  return $.text().replace(/\s+/g, " ").trim();
}

function resolveUrl(base: string, link: string): string {
  try {
    return new URL(link, base).href;
  } catch {
    return link;
  }
}

export async function parseRssSource(
  source: NewsSourceConfig,
): Promise<RawArticle[]> {
  const xml = await fetchWithRetry(source.url);
  const $ = cheerio.load(xml, { xmlMode: true });
  const articles: RawArticle[] = [];
  const limit = source.maxPerRun ?? 30;

  $("item").each((_, el) => {
    if (articles.length >= limit) return false;

    const title = stripCdata($(el).find("title").first().text().trim());
    const link =
      $(el).find("link").first().text().trim() ||
      $(el).find("guid").first().text().trim();
    const description = cleanHtmlToText(
      stripCdata($(el).find("description").first().text()),
    );
    const contentEncoded = cleanHtmlToText(
      stripCdata($(el).find("content\\:encoded, encoded").first().text()),
    );
    const pubDateRaw =
      $(el).find("pubDate").first().text() ||
      $(el).find("dc\\:date, date").first().text() ||
      $(el).find("published").first().text();

    const publishedAt = parseArticleDate(pubDateRaw) ?? new Date();
    const enclosure = $(el).find("enclosure").attr("url");
    const mediaContent =
      $(el).find("media\\:content, content").attr("url") ||
      $(el).find("media\\:thumbnail").attr("url");

    if (!title || !link) return;

    articles.push({
      title,
      content: contentEncoded || description || title,
      sourceName: source.name,
      sourceUrl: resolveUrl(source.url, link),
      imageUrl: enclosure || mediaContent || null,
      publishedAt,
      articleUrl: resolveUrl(source.url, link),
    });
  });

  // Atom feed fallback
  if (articles.length === 0) {
    $("entry").each((_, el) => {
      if (articles.length >= limit) return false;

      const title = $(el).find("title").first().text().trim();
      const link =
        $(el).find("link").attr("href") ||
        $(el).find("id").first().text().trim();
      const summary = cleanHtmlToText($(el).find("summary").first().text());
      const content = cleanHtmlToText($(el).find("content").first().text());
      const publishedAt =
        parseArticleDate($(el).find("published, updated").first().text()) ??
        new Date();

      if (!title || !link) return;

      articles.push({
        title,
        content: content || summary || title,
        sourceName: source.name,
        sourceUrl: resolveUrl(source.url, link),
        publishedAt,
        articleUrl: resolveUrl(source.url, link),
      });
    });
  }

  logger.info(`RSS [${source.name}] ${source.id}: ${articles.length} item`);
  return articles;
}
