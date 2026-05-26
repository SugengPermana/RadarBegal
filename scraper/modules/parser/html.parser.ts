import * as cheerio from 'cheerio';
import type { NewsSourceConfig, RawArticle } from '../../types/article';
import { fetchWithRetry } from '../../lib/http';
import { parseArticleDate } from '../../lib/date';
import { logger } from '../../lib/logger';

interface HtmlSelectorSet {
  article: string;
  title: string;
  link: string;
  summary?: string;
  date?: string;
  image?: string;
}

const SELECTORS: Record<string, HtmlSelectorSet> = {
  detik: {
    article: 'article, .list-content__item, .media__link',
    title: 'h3, h2, .media__title',
    link: 'a',
    summary: 'p, .media__desc',
    date: 'time, .date',
    image: 'img',
  },
  kompas: {
    article: '.articleItem, article',
    title: 'h3, .articleTitle',
    link: 'a',
    summary: 'p',
    date: 'time, .articleDate',
    image: 'img',
  },
  tribun: {
    article: 'li, article, .paging__item',
    title: 'h3, h4, a',
    link: 'a',
    summary: 'p',
    date: 'time, span',
    image: 'img',
  },
  generic: {
    article: 'article, li, .item, .post',
    title: 'h1, h2, h3, a',
    link: 'a',
    summary: 'p',
    date: 'time',
    image: 'img',
  },
};

function resolveUrl(base: string, link: string): string {
  try {
    return new URL(link, base).href;
  } catch {
    return link;
  }
}

export async function parseHtmlSource(
  source: NewsSourceConfig
): Promise<RawArticle[]> {
  const html = await fetchWithRetry(source.url);
  const $ = cheerio.load(html);
  const parserKey = source.parser ?? 'generic';
  const sel = SELECTORS[parserKey] ?? SELECTORS.generic;
  const articles: RawArticle[] = [];
  const limit = source.maxPerRun ?? 15;
  const seenUrls = new Set<string>();

  $(sel.article).each((_, el) => {
    if (articles.length >= limit) return false;

    const $el = $(el);
    const title = $el.find(sel.title).first().text().trim();
    let href =
      $el.find(sel.link).first().attr('href') ||
      $el.closest('a').attr('href') ||
      $el.attr('href');

    if (!title || !href) return;
    href = resolveUrl(source.url, href);
    if (seenUrls.has(href)) return;
    seenUrls.add(href);

    const summary = sel.summary
      ? $el.find(sel.summary).first().text().trim()
      : '';
    const dateRaw = sel.date ? $el.find(sel.date).first().attr('datetime') ||
      $el.find(sel.date).first().text() : undefined;
    const publishedAt = parseArticleDate(dateRaw) ?? new Date();
    const imageUrl = sel.image
      ? $el.find(sel.image).first().attr('src') || null
      : null;

    articles.push({
      title,
      content: summary || title,
      sourceName: source.name,
      sourceUrl: href,
      imageUrl: imageUrl ? resolveUrl(source.url, imageUrl) : null,
      publishedAt,
      articleUrl: href,
    });
  });

  logger.info(`HTML [${source.name}] ${source.id}: ${articles.length} item`);
  return articles;
}
