import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { HiringDecision } from '../../interfaces/hiring-decision';
import { hiringDecision } from '../../utils/hiring-decision';

const CONFETTI_COUNT: number = 40;

@Component({
  selector: 'app-hiring-verdict',
  styleUrl: './hiring-verdict.scss',
  templateUrl: './hiring-verdict.html',
})
export class HiringVerdict {
  public readonly score: InputSignal<number> = input.required<number>();

  protected readonly verdict: Signal<HiringDecision> = computed(() => hiringDecision(this.score()));
  protected readonly confetti: readonly number[] = Array.from({ length: CONFETTI_COUNT }, (_: unknown, index: number) => index);
}
