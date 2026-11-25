import { Component, input, InputSignal } from '@angular/core';
import { GaugeDefinition } from '../../interfaces/gauge-definition';
import { GaugeEffects, Gauges } from '../../interfaces/simulation';
import { GAUGE_DEFINITIONS } from '../../utils/gauge-definitions';

const HIGH_LEVEL: number = 60;
const LOW_LEVEL: number = 30;

@Component({
  selector: 'app-gauge-panel',
  styleUrl: './gauge-panel.scss',
  templateUrl: './gauge-panel.html',
})
export class GaugePanel {
  public readonly gauges: InputSignal<Gauges> = input.required<Gauges>();
  public readonly lastEffects: InputSignal<GaugeEffects | null> = input<GaugeEffects | null>(null);

  protected readonly definitions: readonly GaugeDefinition[] = GAUGE_DEFINITIONS;

  protected level(value: number): 'high' | 'medium' | 'low' {
    return value >= HIGH_LEVEL ? 'high' : value >= LOW_LEVEL ? 'medium' : 'low';
  }
}
