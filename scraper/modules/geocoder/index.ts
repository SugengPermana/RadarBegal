import { geocodeWithMapbox, geocodeWithNominatim } from './nominatim.geocoder';
import type { GeocodeResult } from './nominatim.geocoder';

export type { GeocodeResult };

export async function geocodeLocation(query: string): Promise<GeocodeResult | null> {
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;

  if (mapboxToken) {
    const mb = await geocodeWithMapbox(query, mapboxToken);
    if (mb) return mb;
  }

  return geocodeWithNominatim(query);
}
