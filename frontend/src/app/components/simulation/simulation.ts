import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, effect, inject, Signal, signal, untracked, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatMessage } from '../../interfaces/chat-message';
import { Character, DayEvent, Mood } from '../../interfaces/scenario';
import { Exchange, GaugeEffects, Simulation } from '../../interfaces/simulation';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth-service';
import { SimulationService } from '../../services/simulation-service';
import { SpeechService } from '../../services/speech-service';
import { ErrorMessage } from '../error-message/error-message';
import { GaugePanel } from '../gauge-panel/gauge-panel';
import { Loader } from '../loader/loader';
import { httpErrorMessage } from '../../utils/http-error-message';
import { Conversation } from '../conversation/conversation';
import { DayClock } from '../day-clock/day-clock';
import { DayIntro } from '../day-intro/day-intro';
import { EffectBurst } from '../effect-burst/effect-burst';
import { ReplyBox } from '../reply-box/reply-box';
import { SceneStage } from '../scene-stage/scene-stage';
import { WorkDocument } from '../work-document/work-document';

type SimulationStep = 'starting' | 'intro' | 'playing' | 'finishing';

@Component({
  imports: [ErrorMessage, GaugePanel, Loader, Conversation, DayClock, DayIntro, EffectBurst, ReplyBox, SceneStage, WorkDocument],
  selector: 'app-simulation',
  styleUrl: './simulation.scss',
  templateUrl: './simulation.html',
})
export class SimulationPage {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly simulationService: SimulationService = inject(SimulationService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  protected readonly speechService: SpeechService = inject(SpeechService);
  /** Nombre de messages déjà passés à la voix, pour ne lire que les nouveaux. */
  private spokenCount: number = 0;

  protected readonly playerName: Signal<string> = computed(() => {
    const user: User | null = this.authService.user();
    return user ? `${user.firstName} ${user.lastName}` : 'Nouvelle recrue';
  });

  protected readonly step: WritableSignal<SimulationStep> = signal<SimulationStep>('starting');
  protected readonly simulation: WritableSignal<Simulation | null> = signal<Simulation | null>(null);
  protected readonly sending: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly lastEffects: WritableSignal<GaugeEffects | null> = signal<GaugeEffects | null>(null);
  protected readonly error: WritableSignal<string | null> = signal<string | null>(null);

  protected readonly currentIndex: Signal<number> = computed(() => this.simulation()?.exchanges.length ?? 0);
  protected readonly isDayOver: Signal<boolean> = computed(() => {
    const simulation: Simulation | null = this.simulation();
    return simulation !== null && (this.currentIndex() >= simulation.scenario.events.length || this.hasEmptyGauge(simulation));
  });
  protected readonly currentEvent: Signal<DayEvent | null> = computed(() =>
    this.isDayOver() ? null : (this.simulation()?.scenario.events[this.currentIndex()] ?? null),
  );
  /** L'heure de la situation en cours, ou de la dernière une fois la journée finie. */
  protected readonly clockTime: Signal<string | null> = computed(
    () => (this.currentEvent() ?? this.simulation()?.scenario.events[this.currentIndex() - 1])?.time ?? null,
  );
  protected readonly speaker: Signal<Character | null> = computed(() => {
    const simulation: Simulation | null = this.simulation();
    const event: DayEvent | undefined = this.currentEvent() ?? simulation?.scenario.events[this.currentIndex() - 1];
    return simulation?.scenario.characters.find((character: Character) => character.id === event?.characterId) ?? null;
  });
  protected readonly speakerMood: Signal<Mood> = computed(() => {
    const simulation: Simulation | null = this.simulation();
    const lastExchange: Exchange | undefined = simulation?.exchanges.at(-1);
    const lastSpeakerId: string | undefined = simulation?.scenario.events[this.currentIndex() - 1]?.characterId;
    return lastExchange && lastSpeakerId === this.speaker()?.id ? lastExchange.mood : 'neutre';
  });
  protected readonly messages: Signal<ChatMessage[]> = computed(() => this.buildMessages());
  /** La dernière réplique s'affiche dans la bulle de la scène, la conversation garde tout ce qui précède. */
  protected readonly currentLine: Signal<string> = computed(() => this.messages().at(-1)?.text ?? '');
  protected readonly history: Signal<ChatMessage[]> = computed(() => this.messages().slice(0, -1));

  constructor() {
    this.start();
    effect(() => this.speakNewMessages(this.messages()));
    this.destroyRef.onDestroy(() => this.speechService.stop());
  }

  protected start(): void {
    const offerId: string = this.route.snapshot.paramMap.get('offerId') ?? '';
    this.error.set(null);
    this.step.set('starting');

    this.simulationService
      .create(offerId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (simulation: Simulation) => {
          this.simulation.set(simulation);
          this.step.set('intro');
        },
        error: (error: HttpErrorResponse) => this.error.set(httpErrorMessage(error)),
      });
  }

  protected begin(): void {
    this.step.set('playing');
  }

  protected sendReply(reply: string): void {
    this.answer(reply, false);
  }

  protected onTimeout(): void {
    this.answer('', true);
  }

  protected finish(): void {
    const simulation: Simulation | null = this.simulation();
    if (!simulation) {
      return;
    }

    this.error.set(null);
    this.step.set('finishing');

    this.simulationService
      .finish(simulation.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => void this.router.navigate(['/result', simulation.id]),
        error: (error: HttpErrorResponse) => this.error.set(httpErrorMessage(error)),
      });
  }

  private answer(reply: string, timedOut: boolean): void {
    const simulation: Simulation | null = this.simulation();
    if (!simulation || this.sending()) {
      return;
    }

    this.sending.set(true);
    this.error.set(null);

    this.simulationService
      .reply(simulation.id, { reply, timedOut })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated: Simulation) => {
          this.simulation.set(updated);
          this.lastEffects.set(updated.exchanges.at(-1)?.effects ?? null);
          this.sending.set(false);

          if (this.isDayOver()) {
            this.finish();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(httpErrorMessage(error));
          this.sending.set(false);
        },
      });
  }

  private buildMessages(): ChatMessage[] {
    const simulation: Simulation | null = this.simulation();
    if (!simulation) {
      return [];
    }

    const shownEvents: number = Math.min(this.currentIndex() + 1, simulation.scenario.events.length);

    return simulation.scenario.events.slice(0, shownEvents).flatMap((event: DayEvent, index: number) => {
      const messages: ChatMessage[] = [
        { id: `${index}-event`, author: 'character', characterId: event.characterId, text: event.message, time: event.time },
      ];
      const exchange: Exchange | undefined = simulation.exchanges[index];

      if (exchange) {
        messages.push(
          exchange.timedOut
            ? { id: `${index}-reply`, author: 'narrator', characterId: null, text: "⏰ Temps écoulé : tu n'as pas réagi.", time: event.time }
            : { id: `${index}-reply`, author: 'player', characterId: null, text: exchange.reply, time: event.time },
          { id: `${index}-reaction`, author: 'character', characterId: event.characterId, text: exchange.reaction, time: event.time },
        );
      }

      return messages;
    });
  }

  /** Lit à voix haute les nouvelles répliques des personnages, dans l'ordre (réaction puis situation suivante). */
  private speakNewMessages(messages: ChatMessage[]): void {
    const step: SimulationStep = this.step();
    if (step !== 'playing' && step !== 'finishing') {
      return;
    }

    const newLines: ChatMessage[] = messages.slice(this.spokenCount).filter((message: ChatMessage) => message.author === 'character');
    this.spokenCount = messages.length;

    if (newLines.length === 0) {
      return;
    }

    untracked(() => {
      this.speechService.stop();
      newLines.forEach((message: ChatMessage) => this.speechService.speak(message.text, this.characterIndex(message.characterId)));
    });
  }

  private characterIndex(characterId: string | null): number {
    const characters: Character[] = this.simulation()?.scenario.characters ?? [];
    return Math.max(0, characters.findIndex((character: Character) => character.id === characterId));
  }

  private hasEmptyGauge(simulation: Simulation): boolean {
    return Object.values(simulation.gauges).some((value: number) => value === 0);
  }
}
