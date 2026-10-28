import { GaugeDefinition, GaugeEffects, Gauges } from '../../interfaces/simulation';

export const GAUGE_DEFINITIONS: readonly GaugeDefinition[] = [
  { key: 'team', label: "Moral de l'équipe", emoji: '😊', gameOverMessage: "L'équipe est à bout : deux développeurs posent leur démission." },
  { key: 'client', label: 'Satisfaction client', emoji: '🤝', gameOverMessage: 'Le client est furieux et met fin au contrat.' },
  { key: 'time', label: 'Temps', emoji: '⏱️', gameOverMessage: 'Plus aucune marge : la livraison est officiellement en retard.' },
  { key: 'quality', label: 'Qualité', emoji: '✅', gameOverMessage: 'Trop de bugs en production : le produit est retiré en urgence.' },
];

export const INITIAL_GAUGES: Gauges = { team: 60, client: 60, time: 60, quality: 60 };

export function applyEffects(gauges: Gauges, effects: GaugeEffects): Gauges {
  const clamp = (value: number): number => Math.min(100, Math.max(0, value));

  return {
    team: clamp(gauges.team + effects.team),
    client: clamp(gauges.client + effects.client),
    time: clamp(gauges.time + effects.time),
    quality: clamp(gauges.quality + effects.quality),
  };
}

export function emptyGauge(gauges: Gauges): GaugeDefinition | null {
  return GAUGE_DEFINITIONS.find((definition: GaugeDefinition) => gauges[definition.key] === 0) ?? null;
}

export function gaugeLevel(value: number): 'high' | 'medium' | 'low' {
  if (value > 60) {
    return 'high';
  }
  return value > 30 ? 'medium' : 'low';
}
