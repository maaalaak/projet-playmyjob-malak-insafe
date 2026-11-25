import { Component, computed, DestroyRef, effect, inject, input, InputSignal, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { interval, Subscription, take } from 'rxjs';
import { Character, Mood } from '../../interfaces/scenario';
import { SceneTheme } from '../../interfaces/scene-theme';
import { minutesOfDay } from '../../utils/minutes-of-day';

const TYPING_TICK_MS: number = 30;
/** Une réplique s'écrit en 80 étapes au plus : même un long texte apparaît en moins de 3 secondes. */
const TYPING_MAX_TICKS: number = 80;

/** Le soleil se lève à 7 h et se couche à 19 h dans la fenêtre du décor. */
const SUNRISE_MINUTES: number = 7 * 60;
const DAYLIGHT_MINUTES: number = 12 * 60;
const MORNING_END_MINUTES: number = 10 * 60;
const EVENING_START_MINUTES: number = 17 * 60;

type SkyPhase = 'morning' | 'day' | 'evening';

const MOOD_ICONS: Readonly<Record<Mood, string>> = { content: '😊', neutre: '😐', inquiet: '😟', agace: '😠' };
const MOOD_LABELS: Readonly<Record<Mood, string>> = { content: 'content', neutre: 'neutre', inquiet: 'inquiet', agace: 'agacé' };

const SCENE_THEMES: readonly SceneTheme[] = [
  { name: 'medical', props: ['🩺', '💊'], keywords: ['hopital', 'clinique', 'urgence', 'soin', 'pharmac', 'ehpad', 'medic', 'infirm', 'patient'] },
  { name: 'kitchen', props: ['🍳', '🥖'], keywords: ['restaurant', 'cuisine', 'boulang', 'cafe', 'brasserie', 'hotel', 'traiteur'] },
  { name: 'workshop', props: ['🦺', '🔧'], keywords: ['chantier', 'atelier', 'usine', 'entrepot', 'garage', 'logistique', 'ferme', 'jardin', 'production'] },
  { name: 'shop', props: ['🛒', '🏷️'], keywords: ['magasin', 'boutique', 'commerce', 'supermarche', 'rayon', 'vente', 'caisse'] },
  { name: 'school', props: ['📚', '✏️'], keywords: ['ecole', 'college', 'lycee', 'classe', 'creche', 'universite', 'eleve'] },
];
const OFFICE_THEME: SceneTheme = { name: 'office', props: ['💻', '☕'], keywords: [] };

@Component({
  selector: 'app-scene-stage',
  styleUrl: './scene-stage.scss',
  templateUrl: './scene-stage.html',
})
export class SceneStage {
  public readonly setting: InputSignal<string> = input.required<string>();
  public readonly characters: InputSignal<Character[]> = input.required<Character[]>();
  public readonly speakerId: InputSignal<string | null> = input<string | null>(null);
  public readonly mood: InputSignal<Mood> = input<Mood>('neutre');
  public readonly thinking: InputSignal<boolean> = input<boolean>(false);
  /** La dernière réplique du personnage qui parle, écrite lettre par lettre dans la bulle. */
  public readonly line: InputSignal<string> = input<string>('');
  /** L'heure de la situation : elle déplace le soleil et change la couleur du ciel. */
  public readonly time: InputSignal<string> = input<string>('09:00');

  protected readonly typedLine: WritableSignal<string> = signal<string>('');
  protected readonly isTyping: Signal<boolean> = computed(() => this.typedLine().length < this.line().length);
  protected readonly speakerName: Signal<string> = computed(
    () => this.characters().find((character: Character) => character.id === this.speakerId())?.name ?? '',
  );
  protected readonly moodIcon: Signal<string> = computed(() => MOOD_ICONS[this.mood()]);
  protected readonly moodLabel: Signal<string> = computed(() => MOOD_LABELS[this.mood()]);
  protected readonly theme: Signal<SceneTheme> = computed(() => {
    const setting: string = this.setting().normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
    return SCENE_THEMES.find((theme: SceneTheme) => theme.keywords.some((keyword: string) => setting.includes(keyword))) ?? OFFICE_THEME;
  });

  private readonly minutes: Signal<number> = computed(() => minutesOfDay(this.time()));
  protected readonly skyPhase: Signal<SkyPhase> = computed(() =>
    this.minutes() < MORNING_END_MINUTES ? 'morning' : this.minutes() >= EVENING_START_MINUTES ? 'evening' : 'day',
  );
  private readonly dayProgress: Signal<number> = computed(() =>
    Math.min(Math.max((this.minutes() - SUNRISE_MINUTES) / DAYLIGHT_MINUTES, 0), 1),
  );
  /** Le soleil suit un arc : il monte jusqu'à midi puis redescend. */
  protected readonly sunLeft: Signal<number> = computed(() => this.dayProgress() * 100);
  protected readonly sunTop: Signal<number> = computed(() => 85 - Math.sin(this.dayProgress() * Math.PI) * 65);

  private typing: Subscription | null = null;

  constructor() {
    effect(() => {
      const line: string = this.line();
      untracked(() => this.type(line));
    });
    inject(DestroyRef).onDestroy(() => this.typing?.unsubscribe());
  }

  /** Un clic sur la bulle affiche tout de suite la réplique entière. */
  protected skipTyping(): void {
    this.typing?.unsubscribe();
    this.typedLine.set(this.line());
  }

  private type(line: string): void {
    this.typing?.unsubscribe();
    this.typedLine.set('');

    const lettersPerTick: number = Math.max(1, Math.ceil(line.length / TYPING_MAX_TICKS));
    this.typing = interval(TYPING_TICK_MS)
      .pipe(take(Math.ceil(line.length / lettersPerTick)))
      .subscribe((tick: number) => this.typedLine.set(line.slice(0, (tick + 1) * lettersPerTick)));
  }
}
