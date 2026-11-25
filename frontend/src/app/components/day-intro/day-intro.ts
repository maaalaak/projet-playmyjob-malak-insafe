import { Component, computed, DestroyRef, inject, input, InputSignal, output, OutputEmitterRef, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { timer } from 'rxjs';
import { Simulation } from '../../interfaces/simulation';

/** Le temps de voir le badge passer au vert avant que la journée commence. */
const BADGE_SCAN_MS: number = 900;

@Component({
  imports: [MatButtonModule],
  selector: 'app-day-intro',
  styleUrl: './day-intro.scss',
  templateUrl: './day-intro.html',
})
export class DayIntro {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public readonly simulation: InputSignal<Simulation> = input.required<Simulation>();
  public readonly playerName: InputSignal<string> = input<string>('Nouvelle recrue');
  public readonly started: OutputEmitterRef<void> = output<void>();

  protected readonly scanned: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly initial: Signal<string> = computed(() => this.playerName().charAt(0).toUpperCase());
  protected readonly badgeNumber: Signal<string> = computed(() => `PMJ-${this.simulation().id.slice(0, 6).toUpperCase()}`);

  /** Le joueur badge : le badge passe au vert, puis la journée commence. */
  protected scanBadge(): void {
    if (this.scanned()) {
      return;
    }

    this.scanned.set(true);
    timer(BADGE_SCAN_MS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.started.emit());
  }
}
