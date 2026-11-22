import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { Character, DayEvent } from '../../interfaces/scenario';
import { Exchange, Simulation } from '../../interfaces/simulation';

interface RecapItem {
  event: DayEvent;
  character: Character | undefined;
  exchange: Exchange;
}

@Component({
  selector: 'app-day-recap',
  styleUrl: './day-recap.scss',
  templateUrl: './day-recap.html',
})
export class DayRecap {
  public readonly simulation: InputSignal<Simulation> = input.required<Simulation>();

  protected readonly items: Signal<RecapItem[]> = computed(() => {
    const { scenario, exchanges } = this.simulation();
    return exchanges.map((exchange: Exchange, index: number) => {
      const event: DayEvent = scenario.events[index];
      const character: Character | undefined = scenario.characters.find((item: Character) => item.id === event.characterId);
      return { event, character, exchange };
    });
  });
}
