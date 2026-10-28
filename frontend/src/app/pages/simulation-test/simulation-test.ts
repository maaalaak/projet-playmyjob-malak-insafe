import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { timer } from 'rxjs';
import {
  AiProviderChoice,
  AiResponse,
  Character,
  CharacterReply,
  ChatMessage,
  DayEvent,
  DayScript,
  Exchange,
  GaugeDefinition,
  GaugeEffects,
  Gauges,
  JobTitle,
  SimulationResult,
  SimulationStep,
} from '../../interfaces/simulation';
import { SimulationTestService } from '../../services/simulation-test-service';
import { httpErrorMessage } from '../../shared/utils/http-error-message';
import { ChatWindow } from './chat-window/chat-window';
import { ContactList } from './contact-list/contact-list';
import { Countdown } from './countdown/countdown';
import { GaugePanel } from './gauge-panel/gauge-panel';
import { applyEffects, emptyGauge, INITIAL_GAUGES } from './gauges';
import { ResultCard } from './result-card/result-card';

const URGENT_SECONDS: number = 45;
const TYPING_DELAY_MS: number = 1500;
const NEXT_EVENT_DELAY_MS: number = 2500;
const NOTIFICATION_MS: number = 3000;

@Component({
  imports: [ReactiveFormsModule, ChatWindow, ContactList, Countdown, GaugePanel, ResultCard],
  selector: 'app-simulation-test',
  styleUrl: './simulation-test.scss',
  templateUrl: './simulation-test.html',
})
export class SimulationTest {
  private readonly simulationTestService: SimulationTestService = inject(SimulationTestService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private nextMessageId: number = 1;

  protected readonly urgentSeconds: number = URGENT_SECONDS;
  protected readonly jobTitles: readonly JobTitle[] = ['Product Owner', 'Développeur', 'Data Analyst', 'UX Designer'];
  protected readonly providerOptions: readonly { value: AiProviderChoice; label: string }[] = [
    { value: 'auto', label: 'Auto (Gemini, puis Groq en secours)' },
    { value: 'gemini', label: 'Gemini seulement' },
    { value: 'groq', label: 'Groq seulement' },
  ];

  protected readonly setupForm: FormGroup<{
    jobTitle: FormControl<JobTitle>;
    provider: FormControl<AiProviderChoice>;
  }> = new FormGroup({
    jobTitle: new FormControl<JobTitle>('Product Owner', { nonNullable: true, validators: [Validators.required] }),
    provider: new FormControl<AiProviderChoice>('auto', { nonNullable: true }),
  });

  protected readonly step: WritableSignal<SimulationStep> = signal<SimulationStep>('setup');
  protected readonly day: WritableSignal<AiResponse<DayScript> | null> = signal<AiResponse<DayScript> | null>(null);
  protected readonly eventIndex: WritableSignal<number> = signal<number>(0);
  protected readonly messages: WritableSignal<ChatMessage[]> = signal<ChatMessage[]>([]);
  protected readonly gauges: WritableSignal<Gauges> = signal<Gauges>(INITIAL_GAUGES);
  protected readonly lastEffects: WritableSignal<GaugeEffects | null> = signal<GaugeEffects | null>(null);
  protected readonly exchanges: WritableSignal<Exchange[]> = signal<Exchange[]>([]);
  protected readonly typingCharacter: WritableSignal<Character | null> = signal<Character | null>(null);
  protected readonly canReply: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly notification: WritableSignal<string | null> = signal<string | null>(null);
  protected readonly gameOver: WritableSignal<GaugeDefinition | null> = signal<GaugeDefinition | null>(null);
  protected readonly analysis: WritableSignal<AiResponse<SimulationResult> | null> = signal(null);
  protected readonly error: WritableSignal<string | null> = signal<string | null>(null);

  protected readonly characters: Signal<Character[]> = computed(() => this.day()?.data.characters ?? []);
  protected readonly events: Signal<DayEvent[]> = computed(() => this.day()?.data.events ?? []);
  protected readonly currentEvent: Signal<DayEvent | null> = computed(() => this.events()[this.eventIndex()] ?? null);
  protected readonly currentCharacter: Signal<Character | null> = computed(() => {
    const event: DayEvent | null = this.currentEvent();
    return event ? (this.characters().find((character: Character) => character.id === event.characterId) ?? null) : null;
  });

  protected start(): void {
    this.resetDay();
    this.step.set('generating');

    this.simulationTestService
      .startDay(this.setupForm.getRawValue())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (day: AiResponse<DayScript>) => {
          this.day.set(day);
          this.step.set('playing');
          this.addSystemMessage(`☕ Début de ta journée de ${this.setupForm.controls.jobTitle.value}. Ton équipe va t'écrire ici.`);
          this.deliverCurrentEvent();
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(httpErrorMessage(error));
          this.step.set('setup');
        },
      });
  }

  protected sendReply(playerReply: string): void {
    this.answer(playerReply, false);
  }

  protected onTimeout(): void {
    this.answer('', true);
  }

  protected analyze(): void {
    this.error.set(null);
    this.step.set('analyzing');

    this.simulationTestService
      .analyzeDay({
        ...this.setupForm.getRawValue(),
        exchanges: this.exchanges(),
        gauges: this.gauges(),
        gameOver: this.gameOver() !== null,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (analysis: AiResponse<SimulationResult>) => {
          this.analysis.set(analysis);
          this.step.set('result');
        },
        error: (error: HttpErrorResponse) => this.error.set(httpErrorMessage(error)),
      });
  }

  protected restart(): void {
    this.resetDay();
    this.step.set('setup');
  }

  private deliverCurrentEvent(): void {
    const event: DayEvent | null = this.currentEvent();
    const character: Character | null = this.currentCharacter();
    if (!event || !character) {
      return;
    }

    this.typingCharacter.set(character);
    this.after(TYPING_DELAY_MS, () => {
      this.typingCharacter.set(null);
      this.addMessage({ kind: 'character', characterId: character.id, text: event.message, time: event.time, skill: null });
      this.notify(`💬 Nouveau message de ${character.name}${event.urgent ? ' (urgent)' : ''}`);
      this.canReply.set(true);
    });
  }

  private answer(playerReply: string, timedOut: boolean): void {
    const event: DayEvent | null = this.currentEvent();
    const character: Character | null = this.currentCharacter();
    if (!event || !character || !this.canReply()) {
      return;
    }

    this.canReply.set(false);
    this.error.set(null);
    if (timedOut) {
      this.addSystemMessage(`⏰ Temps écoulé : tu n'as pas répondu à ${character.name}.`);
    } else {
      this.addMessage({ kind: 'player', characterId: null, text: playerReply, time: event.time, skill: null });
    }
    this.typingCharacter.set(character);

    this.simulationTestService
      .reply({ ...this.setupForm.getRawValue(), character, event, playerReply, timedOut, gauges: this.gauges() })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response: AiResponse<CharacterReply>) => {
          const reply: CharacterReply = response.data;
          this.typingCharacter.set(null);
          this.addMessage({ kind: 'character', characterId: character.id, text: reply.reply, time: event.time, skill: reply.skill });
          this.gauges.update((gauges: Gauges) => applyEffects(gauges, reply.effects));
          this.lastEffects.set(reply.effects);
          this.exchanges.update((exchanges: Exchange[]) => [
            ...exchanges,
            { characterRole: character.role, message: event.message, playerReply, timedOut, reaction: reply.reply, skill: reply.skill, effects: reply.effects },
          ]);
          this.goToNextEvent();
        },
        error: (error: HttpErrorResponse) => {
          // On retire la réponse envoyée pour que le joueur puisse la renvoyer.
          this.typingCharacter.set(null);
          this.messages.update((messages: ChatMessage[]) => messages.slice(0, -1));
          this.error.set(httpErrorMessage(error));
          this.canReply.set(true);
        },
      });
  }

  private goToNextEvent(): void {
    const empty: GaugeDefinition | null = emptyGauge(this.gauges());
    if (empty) {
      this.gameOver.set(empty);
      this.addSystemMessage(`🚨 ${empty.gameOverMessage}`);
    }
    const isLastEvent: boolean = this.eventIndex() === this.events().length - 1;

    this.after(NEXT_EVENT_DELAY_MS, () => {
      if (empty || isLastEvent) {
        this.analyze();
        return;
      }
      this.eventIndex.update((index: number) => index + 1);
      this.deliverCurrentEvent();
    });
  }

  private addMessage(message: Omit<ChatMessage, 'id'>): void {
    this.messages.update((messages: ChatMessage[]) => [...messages, { ...message, id: this.nextMessageId++ }]);
  }

  private addSystemMessage(text: string): void {
    this.addMessage({ kind: 'system', characterId: null, text, time: this.currentEvent()?.time ?? '', skill: null });
  }

  private notify(text: string): void {
    this.notification.set(text);
    this.after(NOTIFICATION_MS, () => {
      if (this.notification() === text) {
        this.notification.set(null);
      }
    });
  }

  private after(delayMs: number, action: () => void): void {
    timer(delayMs).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(action);
  }

  private resetDay(): void {
    this.day.set(null);
    this.eventIndex.set(0);
    this.messages.set([]);
    this.gauges.set(INITIAL_GAUGES);
    this.lastEffects.set(null);
    this.exchanges.set([]);
    this.typingCharacter.set(null);
    this.canReply.set(false);
    this.notification.set(null);
    this.gameOver.set(null);
    this.analysis.set(null);
    this.error.set(null);
  }
}
