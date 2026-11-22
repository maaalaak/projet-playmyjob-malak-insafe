import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { Character, Mood } from '../../interfaces/scenario';

const MOOD_ICONS: Readonly<Record<Mood, string>> = { content: '😊', neutre: '😐', inquiet: '😟', agace: '😠' };
const MOOD_LABELS: Readonly<Record<Mood, string>> = {
  content: 'content',
  neutre: 'neutre',
  inquiet: 'inquiet',
  agace: 'agacé',
};

@Component({
  selector: 'app-character-avatar',
  styleUrl: './character-avatar.scss',
  templateUrl: './character-avatar.html',
})
export class CharacterAvatar {
  public readonly character: InputSignal<Character> = input.required<Character>();
  public readonly mood: InputSignal<Mood> = input<Mood>('neutre');
  public readonly thinking: InputSignal<boolean> = input<boolean>(false);

  protected readonly moodIcon: Signal<string> = computed(() => MOOD_ICONS[this.mood()]);
  protected readonly moodLabel: Signal<string> = computed(() => MOOD_LABELS[this.mood()]);
}
