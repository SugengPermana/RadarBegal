import * as cheerio from "cheerio";
import type { RawArticle } from "../../types/article";
import { fetchHtml } from "../../lib/http";
import { parseArticleDate } from "../../lib/date";
import { logger } from "../../lib/logger";

const CONTENT_SELECTORS = [
  ".detail__body-text",
  ".read__content",
  ".detail_text",
  ".article-content",
  ".article__content",
  ".content_article",
  '[itemprop="articleBody"]',
  ".post-content",
  "article p",
];

const DATE_SELECTORS = [
  "time[datetime]",
  'meta[property="article:published_time"]',
];
const IMAGE_SELECTORS = [
  'meta[property="og:image"]',
  'meta[name="twitter:image"]',
];

/**
 * Ambil konten penuh dari halaman artikel jika RSS hanya memberi ringkasan pendek.
 */
export async function enrichArticleContent(
  article: RawArticle,
): Promise<RawArticle> {
  const url = article.articleUrl || article.sourceUrl;
  if (!url || article.content.length > 400) return article;

  try {
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);

    let body = "";
    for (const sel of CONTENT_SELECTORS) {
      const text = $(sel)
        .map((_, el) => $(el).text())
        .get()
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (text.length > body.length) body = text;
    }

    let publishedAt = article.publishedAt;
    for (const sel of DATE_SELECTORS) {
      const raw = $(sel).attr("datetime") || $(sel).attr("content");
      const parsed = parseArticleDate(raw);
      if (parsed) {
        publishedAt = parsed;
        break;
      }
    }

    let imageUrl = article.imageUrl;
    for (const sel of IMAGE_SELECTORS) {
      const img = $(sel).attr("content");
      if (img) {
        imageUrl = img;
        break;
      }
    }

    return {
      ...article,
      content: body || article.content,
      publishedAt,
      imageUrl,
    };
  } catch (err) {
    logger.debug(`Enrich skip: ${url}`, err);
    return article;
  }
}
