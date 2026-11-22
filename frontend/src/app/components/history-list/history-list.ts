import { DatePipe } from '@angular/common';
import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Simulation } from '../../interfaces/simulation';
import { ScoreRing } from '../score-ring/score-ring';

@Component({
  imports: [DatePipe, MatButtonModule, RouterLink, ScoreRing],
  selector: 'app-history-list',
  styleUrl: './history-list.scss',
  templateUrl: './history-list.html',
})
export class HistoryList {
  public readonly simulations: InputSignal<Simulation[]> = input.required<Simulation[]>();
  public readonly deleteRequested: OutputEmitterRef<Simulation> = output<Simulation>();
}
