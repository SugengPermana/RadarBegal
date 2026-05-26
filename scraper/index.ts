import cron from 'node-cron';
import { loadScraperEnv } from './lib/env';
import { CRON_SCHEDULE } from './config/constants';
import { logger } from './lib/logger';
import { runScraper } from './services/scraper.service';

export { runScraper } from './services/scraper.service';

async function main() {
  loadScraperEnv();

  const args = process.argv.slice(2);
  const runOnce = args.includes('--once') || args.includes('-o');
  const noCron = args.includes('--no-cron');

  if (runOnce || noCron) {
    await runScraper();
    if (noCron && !runOnce) return;
    process.exit(0);
  }

  logger.info(`Cron scheduled: ${CRON_SCHEDULE} (setiap 2 jam)`);

  await runScraper();

  cron.schedule(CRON_SCHEDULE, async () => {
    logger.info('Cron trigger — starting scrape...');
    try {
      await runScraper();
    } catch (err) {
      logger.error('Cron scrape failed', err);
    }
  });

  logger.info('Scraper daemon running. Press Ctrl+C to stop.');
}

main().catch((err) => {
  logger.error('Fatal scraper error', err);
  process.exit(1);
});
