export type RiskLevel = "CRITICAL" | "WARNING" | "CAUTION";

export function normalizeRiskLevel(level: string): RiskLevel {
  const upper = level.toUpperCase();
  if (upper === "CRITICAL") return "CRITICAL";
  if (upper === "WARNING") return "WARNING";
  return "CAUTION";
}

export function riskColors(level: string) {
  const risk = normalizeRiskLevel(level);
  switch (risk) {
    case "CRITICAL":
      return { stroke: "#ef4444", fill: "#ef4444" };
    case "WARNING":
      return { stroke: "#f97316", fill: "#f97316" };
    default:
      return { stroke: "#eab308", fill: "#eab308" };
  }
}

export function riskLabel(level: string): string {
  const risk = normalizeRiskLevel(level);
  switch (risk) {
    case "CRITICAL":
      return "Kritis";
    case "WARNING":
      return "Waspada";
    default:
      return "Hati-hati";
  }
}

export function areaWarningMessage(level: string): string {
  const risk = normalizeRiskLevel(level);
  switch (risk) {
    case "CRITICAL":
      return "Anda berada di area rawan pembegalan. Jangan berhenti! Cari jalan alternatif atau jalan yang ramai. Jika terjadi sesuatu harap hubungi pihak berwajib. Mohon lebih berhati-hati.";
    case "WARNING":
      return "Tetap waspada. Hindari melintas sendirian di atas jam 23.00 WIB. Tetap hati-hati dan jangan jalan sendirian.";
    default:
      return "Tetap hati-hati, area ini masih dalam pengawasan indikasi aktivitas pembegalan.";
  }
}
