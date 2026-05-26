import axios from 'axios';
import { GEOCODE_DELAY_MS, SCRAPER_USER_AGENT } from '../../config/constants';
import { isWithinJabodetabek } from '../../config/areas';
import { logger } from '../../lib/logger';

export interface GeocodeResult {
  latitude: number;
  longitude: number;
  displayName: string;
}

let lastGeocodeAt = 0;

async function geocodeThrottle() {
  const now = Date.now();
  const wait = GEOCODE_DELAY_MS - (now - lastGeocodeAt);
  if (wait > 0) await new Promise((r) => setTimeout(r, wait));
  lastGeocodeAt = Date.now();
}

export async function geocodeWithNominatim(
  query: string
): Promise<GeocodeResult | null> {
  await geocodeThrottle();

  try {
    const { data } = await axios.get<
      Array<{ lat: string; lon: string; display_name: string }>
    >('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        format: 'json',
        limit: 1,
        countrycodes: 'id',
      },
      headers: {
        'User-Agent': SCRAPER_USER_AGENT,
      },
      timeout: 15_000,
    });

    if (!data?.length) return null;

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);

    if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

    if (!isWithinJabodetabek(lat, lng)) {
      logger.debug(`Geocode outside Jabodetabek: ${query} -> ${lat},${lng}`);
      return null;
    }

    return {
      latitude: lat,
      longitude: lng,
      displayName: data[0].display_name,
    };
  } catch (err) {
    logger.warn(`Nominatim failed: ${query}`, err);
    return null;
  }
}

export async function geocodeWithMapbox(
  query: string,
  token: string
): Promise<GeocodeResult | null> {
  await geocodeThrottle();

  try {
    const encoded = encodeURIComponent(query);
    const { data } = await axios.get<{
      features: Array<{
        center: [number, number];
        place_name: string;
      }>;
    }>(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encoded}.json`,
      {
        params: {
          access_token: token,
          limit: 1,
          country: 'id',
          proximity: '106.8456,-6.2088',
        },
        timeout: 15_000,
      }
    );

    const feature = data.features?.[0];
    if (!feature) return null;

    const [lng, lat] = feature.center;
    if (!isWithinJabodetabek(lat, lng)) return null;

    return {
      latitude: lat,
      longitude: lng,
      displayName: feature.place_name,
    };
  } catch (err) {
    logger.warn(`Mapbox failed: ${query}`, err);
    return null;
  }
}
