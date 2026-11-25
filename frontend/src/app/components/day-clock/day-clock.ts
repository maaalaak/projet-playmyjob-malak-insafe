import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { minutesOfDay } from '../../utils/minutes-of-day';

@Component({
  selector: 'app-day-clock',
  styleUrl: './day-clock.scss',
  templateUrl: './day-clock.html',
})
export class DayClock {
  public readonly time: InputSignal<string> = input.required<string>();

  private readonly minutes: Signal<number> = computed(() => minutesOfDay(this.time()));
  // Les angles ne repartent pas à zéro : quand l'heure avance, les aiguilles tournent toujours dans le bon sens.
  protected readonly hourAngle: Signal<number> = computed(() => this.minutes() * 0.5);
  protected readonly minuteAngle: Signal<number> = computed(() => this.minutes() * 6);
}
