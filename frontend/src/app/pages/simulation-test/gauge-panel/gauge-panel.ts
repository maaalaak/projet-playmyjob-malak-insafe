import { Component, Input } from '@angular/core';
import { GaugeDefinition, GaugeEffects, Gauges } from '../../../interfaces/simulation';
import { GAUGE_DEFINITIONS, gaugeLevel } from '../gauges';

@Component({
  imports: [],
  selector: 'app-gauge-panel',
  styleUrl: './gauge-panel.scss',
  templateUrl: './gauge-panel.html',
})
export class GaugePanel {
  @Input({ required: true }) public gauges!: Gauges;
  @Input() public lastEffects: GaugeEffects | null = null;
  /** Numéro de l'échange en cours : quand il change, l'animation des « +8 / -12 » se rejoue. */
  @Input() public round: number = 0;

  protected readonly definitions: readonly GaugeDefinition[] = GAUGE_DEFINITIONS;
  protected readonly level: (value: number) => 'high' | 'medium' | 'low' = gaugeLevel;
}
