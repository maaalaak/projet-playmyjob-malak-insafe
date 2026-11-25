import { GaugeDefinition } from '../interfaces/gauge-definition';

/** Les quatre jauges de la journée, dans l'ordre d'affichage. */
export const GAUGE_DEFINITIONS: readonly GaugeDefinition[] = [
  { key: 'team', label: "Moral de l'équipe", icon: '🤝' },
  { key: 'client', label: 'Personnes servies', icon: '🙂' },
  { key: 'time', label: 'Temps', icon: '⏱️' },
  { key: 'quality', label: 'Qualité', icon: '⭐' },
];
