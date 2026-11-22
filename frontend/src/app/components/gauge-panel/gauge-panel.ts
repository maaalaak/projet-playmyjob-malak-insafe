import { Component, input, InputSignal } from '@angular/core';
import { GaugeEffects, Gauges } from '../../interfaces/simulation';

interface GaugeDefinition {
  key: keyof Gauges;
  label: string;
  icon: string;
}

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

  protected readonly definitions: readonly GaugeDefinition[] = [
    { key: 'team', label: "Moral de l'équipe", icon: '🤝' },
    { key: 'client', label: 'Personnes servies', icon: '🙂' },
    { key: 'time', label: 'Temps', icon: '⏱️' },
    { key: 'quality', label: 'Qualité', icon: '⭐' },
  ];

  protected level(value: number): 'high' | 'medium' | 'low' {
    return value >= HIGH_LEVEL ? 'high' : value >= LOW_LEVEL ? 'medium' : 'low';
  }
}
