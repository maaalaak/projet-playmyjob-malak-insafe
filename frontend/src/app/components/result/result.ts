import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Simulation } from '../../interfaces/simulation';
import { SimulationService } from '../../services/simulation-service';
import { SpeechService } from '../../services/speech-service';
import { hiringDecision } from '../../utils/hiring-decision';
import { httpErrorMessage } from '../../utils/http-error-message';
import { DayRecap } from '../day-recap/day-recap';
import { EmptyState } from '../empty-state/empty-state';
import { ErrorMessage } from '../error-message/error-message';
import { GaugePanel } from '../gauge-panel/gauge-panel';
import { HiringVerdict } from '../hiring-verdict/hiring-verdict';
import { Loader } from '../loader/loader';
import { ScoreRing } from '../score-ring/score-ring';

@Component({
  imports: [MatButtonModule, RouterLink, DayRecap, EmptyState, ErrorMessage, GaugePanel, HiringVerdict, Loader, ScoreRing],
  selector: 'app-result',
  styleUrl: './result.scss',
  templateUrl: './result.html',
})
export class Result {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly simulationService: SimulationService = inject(SimulationService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly speechService: SpeechService = inject(SpeechService);

  protected readonly simulation: WritableSignal<Simulation | null> = signal<Simulation | null>(null);
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly error: WritableSignal<string | null> = signal<string | null>(null);

  constructor() {
    this.load();
    this.destroyRef.onDestroy(() => this.speechService.stop());
  }

  protected load(): void {
    const id: string = this.route.snapshot.paramMap.get('id') ?? '';
    this.loading.set(true);
    this.error.set(null);

    this.simulationService
      .findById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (simulation: Simulation) => {
          this.simulation.set(simulation);
          this.loading.set(false);
          this.announceVerdict(simulation);
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(httpErrorMessage(error));
          this.loading.set(false);
        },
      });
  }

  /** Le manager annonce sa décision à voix haute (le bouton « Son coupé » de la simulation est respecté). */
  private announceVerdict(simulation: Simulation): void {
    if (simulation.result) {
      this.speechService.speak(hiringDecision(simulation.result.score).speech, 0);
    }
  }
}
