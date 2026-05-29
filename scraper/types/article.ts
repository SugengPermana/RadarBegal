export type SourceType = "rss" | "html";

export interface NewsSourceConfig {
  id: string;
  name: string;
  type: SourceType;
  url: string;
  /** Parser hint for HTML listing pages */
  parser?:
    | "detik"
    | "kompas"
    | "tribun"
    | "cnn"
    | "liputan6"
    | "kumparan"
    | "antara"
    | "generic";
  /** Max articles to process per run from this source */
  maxPerRun?: number;
}

export interface RawArticle {
  title: string;
  content: string;
  sourceName: string;
  sourceUrl: string;
  imageUrl?: string | null;
  publishedAt: Date;
  /** Full article URL if listing only had link */
  articleUrl?: string;
}

export interface ParsedArticle extends RawArticle {
  crimeType: string;
  locationName: string;
  latitude: number;
  longitude: number;
  radiusMeter: number;
  riskLevel: "CRITICAL" | "WARNING" | "CAUTION";
  verificationStatus: string;
  incidentAt: Date;
}

export interface ScraperRunStats {
  sourcesProcessed: number;
  candidatesFound: number;
  inserted: number;
  skippedDuplicate: number;
  skippedIrrelevant: number;
  skippedOld: number;
  skippedNoLocation: number;
  skippedGeocode: number;
  errors: number;
}
