import { Component, computed, effect, input, InputSignal, Signal, signal, WritableSignal } from '@angular/core';
import { interval, map, Subscription, take } from 'rxjs';

const ANIMATION_STEPS: number = 40;
const STEP_MS: number = 30;
const RADIUS: number = 54;
const CIRCUMFERENCE: number = 2 * Math.PI * RADIUS;

@Component({
  selector: 'app-score-ring',
  styleUrl: './score-ring.scss',
  templateUrl: './score-ring.html',
})
export class ScoreRing {
  public readonly score: InputSignal<number> = input.required<number>();
  public readonly size: InputSignal<'small' | 'large'> = input<'small' | 'large'>('large');

  protected readonly radius: number = RADIUS;
  protected readonly circumference: number = CIRCUMFERENCE;
  protected readonly displayed: WritableSignal<number> = signal<number>(0);
  protected readonly dashOffset: Signal<number> = computed(() => CIRCUMFERENCE * (1 - this.displayed() / 100));
  protected readonly level: Signal<'high' | 'medium' | 'low'> = computed(() => {
    const score: number = this.score();
    return score >= 70 ? 'high' : score >= 45 ? 'medium' : 'low';
  });

  constructor() {
    effect((onCleanup: (cleanup: () => void) => void) => {
      const target: number = this.score();
      const animation: Subscription = interval(STEP_MS)
        .pipe(
          take(ANIMATION_STEPS),
          map((step: number) => Math.round((target * (step + 1)) / ANIMATION_STEPS)),
        )
        .subscribe((value: number) => this.displayed.set(value));
      onCleanup(() => animation.unsubscribe());
    });
  }
}
