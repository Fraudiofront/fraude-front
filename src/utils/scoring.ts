/** Umbrales alineados con FraudScoringService (fraude-back/app/integrations/siniestros/scoring.py) */
export const SCORE_THRESHOLD_ROJO = 50
export const SCORE_THRESHOLD_AMARILLO = 25

export type ScoreColor = "Verde" | "Amarillo" | "Rojo"
export type ScoreBand = "Bajo" | "Medio" | "Alto"
export type RiskLevel = "low" | "medium" | "high"

/** A mayor puntaje, mayor probabilidad de fraude → color más severo */
export function scoreToColor(score: number): ScoreColor {
  if (score >= SCORE_THRESHOLD_ROJO) return "Rojo"
  if (score >= SCORE_THRESHOLD_AMARILLO) return "Amarillo"
  return "Verde"
}

export function scoreToBand(score: number): ScoreBand {
  if (score >= SCORE_THRESHOLD_ROJO) return "Alto"
  if (score >= SCORE_THRESHOLD_AMARILLO) return "Medio"
  return "Bajo"
}

export function scoreColorToRiskLevel(color: ScoreColor): RiskLevel {
  if (color === "Rojo") return "high"
  if (color === "Amarillo") return "medium"
  return "low"
}

export function riskLevelToScoreColor(level: RiskLevel): ScoreColor {
  if (level === "high") return "Rojo"
  if (level === "medium") return "Amarillo"
  return "Verde"
}

function isScoreColor(value?: string | null): value is ScoreColor {
  return value === "Verde" || value === "Amarillo" || value === "Rojo"
}

function isScoreBand(value?: string | null): value is ScoreBand {
  return value === "Bajo" || value === "Medio" || value === "Alto"
}

/** Normaliza presentación: prioriza color/banda del backend cuando vienen en la respuesta. */
export function normalizeScorePresentation(
  score: number,
  backendColor?: string | null,
  backendBand?: string | null,
): {
  total_score: number
  score_color: ScoreColor
  score_band: ScoreBand
  riskLevel: RiskLevel
} {
  const score_color = isScoreColor(backendColor) ? backendColor : scoreToColor(score)
  const score_band = isScoreBand(backendBand) ? backendBand : scoreToBand(score)
  return {
    total_score: score,
    score_color,
    score_band,
    riskLevel: scoreColorToRiskLevel(score_color),
  }
}
