export type VerdictLevel = 'hired' | 'trial' | 'declined';

/** La décision du manager en fin de journée, d'après le score. */
export interface HiringDecision {
  level: VerdictLevel;
  stamp: string;
  speech: string;
}
