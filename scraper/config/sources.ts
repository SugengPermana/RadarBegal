import type { NewsSourceConfig } from "../types/article";

/**
 * Daftar sumber berita — tambah URL baru di sini untuk scale horizontal.
 * RSS lebih stabil; HTML untuk halaman tag/pencarian portal.
 */
export const SOURCES: NewsSourceConfig[] = [
  // Detik
  {
    id: "detik-news",
    name: "Detik",
    type: "rss",
    url: "https://news.detik.com/rss",
    maxPerRun: 30,
  },
  {
    id: "detik-jakarta",
    name: "Detik",
    type: "html",
    url: "https://www.detik.com/tag/begal/",
    parser: "detik",
    maxPerRun: 15,
  },

  // Kompas (megapolitan = Jabodetabek)
  {
    id: "kompas-megapolitan-rss",
    name: "Kompas",
    type: "rss",
    url: "https://rss.kompas.com/megapolitan/rss",
    maxPerRun: 30,
  },
  {
    id: "kompas-megapolitan-html",
    name: "Kompas",
    type: "html",
    url: "https://megapolitan.kompas.com/indeks",
    parser: "kompas",
    maxPerRun: 15,
  },

  // Tribun (wilayah Jabodetabek)
  {
    id: "tribun-jakarta",
    name: "Tribun",
    type: "rss",
    url: "https://jakarta.tribunnews.com/rss",
    maxPerRun: 25,
  },
  {
    id: "tribun-bekasi",
    name: "Tribun",
    type: "rss",
    url: "https://bekasi.tribunnews.com/rss",
    maxPerRun: 20,
  },
  {
    id: "tribun-tangerang",
    name: "Tribun",
    type: "rss",
    url: "https://tangerang.tribunnews.com/rss",
    maxPerRun: 20,
  },
  {
    id: "tribun-bogor",
    name: "Tribun",
    type: "rss",
    url: "https://bogor.tribunnews.com/rss",
    maxPerRun: 20,
  },

  // CNN Indonesia
  {
    id: "cnn-nasional",
    name: "CNN Indonesia",
    type: "rss",
    url: "https://www.cnnindonesia.com/nasional/rss",
    maxPerRun: 25,
  },

  // Liputan6
  {
    id: "liputan6-nasional",
    name: "Liputan6",
    type: "html",
    url: "https://www.liputan6.com/tag/begal",
    parser: "liputan6",
    maxPerRun: 15,
  },
  {
    id: "liputan6-news",
    name: "Liputan6",
    type: "rss",
    url: "https://feed.liputan6.com/rss/news",
    maxPerRun: 20,
  },

  // Kumparan
  {
    id: "kumparan-news",
    name: "Kumparan",
    type: "html",
    url: "https://kumparan.com/topik/begal",
    parser: "kumparan",
    maxPerRun: 15,
  },

  // Antara
  {
    id: "antara-terkini",
    name: "Antara",
    type: "rss",
    url: "https://www.antaranews.com/rss/terkini.xml",
    maxPerRun: 25,
  },
  {
    id: "antara-megapolitan",
    name: "Antara",
    type: "rss",
    url: "https://megapolitan.antaranews.com/rss/nasional.xml",
    maxPerRun: 25,
  },

  // Portal tambahan
  {
    id: "sindonews",
    name: "SindoNews",
    type: "rss",
    url: "https://www.sindonews.com/rss",
    maxPerRun: 20,
  },
];
