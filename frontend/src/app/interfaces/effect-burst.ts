export type BurstVerdict = 'good' | 'neutral' | 'bad';

/** Une pastille « +10 ⭐ » qui s'envole de la scène. */
export interface EffectChip {
  key: string;
  icon: string;
  label: string;
  value: number;
}

/** L'effet affiché après une réponse : un message, un halo et les pastilles des jauges. */
export interface Burst {
  key: number;
  verdict: BurstVerdict;
  message: string;
  chips: EffectChip[];
}
