import type { NewsSourceConfig, RawArticle } from "../../types/article";
import { parseRssSource } from "./rss.parser";
import { parseHtmlSource } from "./html.parser";

export async function parseSource(
  source: NewsSourceConfig,
): Promise<RawArticle[]> {
  if (source.type === "rss") {
    return parseRssSource(source);
  }
  return parseHtmlSource(source);
}

export { enrichArticleContent } from "./article.enricher";
