import { JABODETABEK_AREAS } from '../../config/areas';

export interface ExtractedLocation {
  locationName: string;
  geocodeQuery: string;
}

/** Area diurutkan panjang nama desc agar "Jakarta Selatan" menang sebelum "Jakarta" */
const SORTED_AREAS = [...JABODETABEK_AREAS].sort(
  (a, b) => b.name.length - a.name.length
);

const DI_PATTERN =
  /\b(?:di|daerah|kawasan|wilayah|jalan|jl\.?|depan|dekat|sekitar|area)\s+([A-Za-z0-9\s.'-]{3,40})/gi;

export function extractLocationFromText(
  title: string,
  content: string
): ExtractedLocation | null {
  const text = `${title} ${content}`;

  for (const area of SORTED_AREAS) {
    const regex = new RegExp(`\\b${escapeRegex(area.name)}\\b`, 'i');
    if (regex.test(text)) {
      return {
        locationName: area.name,
        geocodeQuery: area.geocodeQuery,
      };
    }
  }

  // Pola "di Kemang", "di Depok", dll.
  let match: RegExpExecArray | null;
  const candidates: string[] = [];
  const diRegex = new RegExp(DI_PATTERN.source, DI_PATTERN.flags);
  while ((match = diRegex.exec(text)) !== null) {
    const place = match[1].trim().replace(/\s+/g, ' ');
    if (place.length >= 3 && place.length <= 40) {
      candidates.push(place);
    }
  }

  for (const place of candidates) {
    const known = SORTED_AREAS.find(
      (a) => a.name.toLowerCase() === place.toLowerCase()
    );
    if (known) {
      return { locationName: known.name, geocodeQuery: known.geocodeQuery };
    }

    const jabodetabekHint = isLikelyJabodetabekPlace(place);
    if (jabodetabekHint) {
      return {
        locationName: place,
        geocodeQuery: `${place}, Jabodetabek, Indonesia`,
      };
    }
  }

  return null;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function isLikelyJabodetabekPlace(place: string): boolean {
  const lower = place.toLowerCase();
  const hints = [
    'jakarta',
    'bogor',
    'depok',
    'tangerang',
    'bekasi',
    'cibubur',
    'kemang',
    'bsd',
    'serpong',
    'cikarang',
    'karawaci',
    'cileungsi',
    'kemayoran',
    'jakbar',
    'jaksel',
    'jakpus',
    'jakut',
    'jakbar',
  ];
  return hints.some((h) => lower.includes(h));
}
