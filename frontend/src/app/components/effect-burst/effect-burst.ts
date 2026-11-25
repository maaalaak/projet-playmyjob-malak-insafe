import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { Burst, BurstVerdict, EffectChip } from '../../interfaces/effect-burst';
import { GaugeDefinition } from '../../interfaces/gauge-definition';
import { GaugeEffects } from '../../interfaces/simulation';
import { GAUGE_DEFINITIONS } from '../../utils/gauge-definitions';

/** Au-delà de +10 ou en dessous de −10 au total, la réponse compte comme bonne ou mauvaise. */
const VERDICT_THRESHOLD: number = 10;
const SPARKLE_COUNT: number = 10;
const MESSAGES: Readonly<Record<BurstVerdict, readonly string[]>> = {
  good: ['👏 Bien joué !', '🔥 Excellent réflexe !', '💪 Ton équipe est impressionnée !'],
  neutral: ['👌 Ça passe', '🙂 Correct', '🤔 Peut mieux faire'],
  bad: ['😬 Aïe…', "😓 Ça ne s'est pas bien passé", '⚠️ Attention !'],
};

@Component({
  selector: 'app-effect-burst',
  styleUrl: './effect-burst.scss',
  templateUrl: './effect-burst.html',
})
export class EffectBurst {
  public readonly effects: InputSignal<GaugeEffects | null> = input<GaugeEffects | null>(null);
  /** Change à chaque réponse : l'effet est recréé et ses animations repartent de zéro. */
  public readonly key: InputSignal<number> = input.required<number>();

  protected readonly sparkles: readonly number[] = Array.from({ length: SPARKLE_COUNT }, (_: unknown, index: number) => index);
  protected readonly bursts: Signal<Burst[]> = computed(() => {
    const effects: GaugeEffects | null = this.effects();
    return effects ? [this.buildBurst(effects, this.key())] : [];
  });

  private buildBurst(effects: GaugeEffects, key: number): Burst {
    const chips: EffectChip[] = GAUGE_DEFINITIONS.filter((gauge: GaugeDefinition) => effects[gauge.key] !== 0).map(
      (gauge: GaugeDefinition) => ({ key: gauge.key, icon: gauge.icon, label: gauge.label, value: effects[gauge.key] }),
    );
    const total: number = chips.reduce((sum: number, chip: EffectChip) => sum + chip.value, 0);
    const verdict: BurstVerdict = total >= VERDICT_THRESHOLD ? 'good' : total <= -VERDICT_THRESHOLD ? 'bad' : 'neutral';
    const messages: readonly string[] = MESSAGES[verdict];

    return { key, verdict, message: messages[key % messages.length], chips };
  }
}
