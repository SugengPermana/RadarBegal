import { RADIUS_BY_RISK } from '../../config/constants';

export type RiskLevel = 'CRITICAL' | 'WARNING' | 'CAUTION';

const CRITICAL_PATTERNS = [
  'korban meninggal',
  'meninggal dunia',
  'tewas',
  'pembunuhan',
  'pembacokan',
  'tusuk',
  'senjata tajam',
  'senjata api',
  'pistol',
  'celurit',
  'sajam',
  'brutal',
  'sadis',
  'komplotan',
  'penikaman',
  'bacok',
];

const WARNING_PATTERNS = [
  'perampasan',
  'dirampas',
  'kekerasan',
  'ancaman',
  'dianiaya',
  'pengeroyokan',
  'dikeroyok',
  'luka-luka',
  'terluka',
  'senjata',
  'begal',
  'jambret',
  'rampok',
];

const CAUTION_PATTERNS = [
  'percobaan',
  'diduga',
  'laporan warga',
  'mencurigakan',
  'aktivitas mencurigakan',
  'peringatan',
  'waspada',
  'indikasi',
  'marak',
  'modus',
];

export function analyzeRiskLevel(title: string, content: string): RiskLevel {
  const text = `${title} ${content}`.toLowerCase();

  if (CRITICAL_PATTERNS.some((p) => text.includes(p))) return 'CRITICAL';
  if (WARNING_PATTERNS.some((p) => text.includes(p))) return 'WARNING';
  if (CAUTION_PATTERNS.some((p) => text.includes(p))) return 'CAUTION';

  // Default untuk berita begal/jambret yang lolos filter keyword
  if (text.includes('begal') || text.includes('jambret') || text.includes('rampok')) {
    return 'WARNING';
  }

  return 'CAUTION';
}

export function radiusForRisk(risk: RiskLevel): number {
  return RADIUS_BY_RISK[risk] ?? 300;
}
