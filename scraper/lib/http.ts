import axios, { AxiosRequestConfig } from 'axios';
import { SCRAPER_USER_AGENT, HTTP_DELAY_MS } from '../config/constants';
import { logger } from './logger';

let lastRequestAt = 0;

async function throttle() {
  const now = Date.now();
  const wait = HTTP_DELAY_MS - (now - lastRequestAt);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastRequestAt = Date.now();
}

export async function fetchHtml(
  url: string,
  config?: AxiosRequestConfig
): Promise<string> {
  await throttle();
  logger.debug(`GET ${url}`);
  const response = await axios.get<string>(url, {
    timeout: 25_000,
    headers: {
      'User-Agent': SCRAPER_USER_AGENT,
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'id-ID,id;q=0.9,en;q=0.5',
      ...config?.headers,
    },
    maxRedirects: 5,
    validateStatus: (s) => s >= 200 && s < 400,
    ...config,
  });
  return response.data;
}

export async function fetchWithRetry(
  url: string,
  retries = 2
): Promise<string> {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fetchHtml(url);
    } catch (err) {
      lastError = err;
      logger.warn(`Retry ${i + 1}/${retries + 1} for ${url}`);
      await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastError;
}
