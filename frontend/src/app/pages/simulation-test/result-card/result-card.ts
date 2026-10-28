import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AiResponse, Exchange, Gauges, SimulationResult } from '../../../interfaces/simulation';
import { GaugePanel } from '../gauge-panel/gauge-panel';

@Component({
  imports: [GaugePanel],
  selector: 'app-result-card',
  styleUrl: './result-card.scss',
  templateUrl: './result-card.html',
})
export class ResultCard {
  @Input({ required: true }) public analysis!: AiResponse<SimulationResult>;
  @Input({ required: true }) public gauges!: Gauges;
  @Input({ required: true }) public exchanges!: Exchange[];
  @Output() public restart: EventEmitter<void> = new EventEmitter<void>();
}
