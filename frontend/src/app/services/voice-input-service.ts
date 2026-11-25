import { inject, NgZone, Service, signal, WritableSignal } from '@angular/core';
import {
  SpeechRecognition,
  SpeechRecognitionConstructor,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionResultEvent,
} from '../interfaces/speech-recognition';

const LANGUAGE: string = 'fr-FR';
const ERROR_MESSAGES: Readonly<Record<string, string>> = {
  'not-allowed': "Autorise l'accès au micro dans ton navigateur pour répondre à voix haute.",
  'no-speech': "Je n'ai rien entendu, réessaie en parlant plus près du micro.",
  'audio-capture': "Aucun micro n'a été trouvé sur cet appareil.",
  network: "La reconnaissance vocale a besoin d'Internet et ne marche que dans Google Chrome ou Edge.",
  'service-not-allowed': 'Ton navigateur bloque la reconnaissance vocale. Utilise Google Chrome ou Edge.',
};
const DEFAULT_ERROR: string = "Le micro s'est arrêté, tu peux réessayer ou écrire ta réponse.";

interface BrowserWithSpeech {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

@Service()
export class VoiceInputService {
  private readonly zone: NgZone = inject(NgZone);
  private readonly recognitionClass: SpeechRecognitionConstructor | undefined = this.findRecognitionClass();
  private recognition: SpeechRecognition | null = null;

  /** Faux si le navigateur ne sait pas écouter (Firefox par exemple) : le bouton micro est remplacé par un conseil. */
  public readonly isSupported: boolean = this.recognitionClass !== undefined;
  public readonly listening: WritableSignal<boolean> = signal<boolean>(false);
  public readonly error: WritableSignal<string | null> = signal<string | null>(null);

  /** Écoute en français et transmet tout le texte reconnu à chaque mot entendu. */
  public start(onText: (text: string) => void): void {
    if (!this.recognitionClass || this.listening()) {
      return;
    }

    const recognition: SpeechRecognition = new this.recognitionClass();
    recognition.lang = LANGUAGE;
    recognition.continuous = true;
    recognition.interimResults = true;

    // Le navigateur appelle ces fonctions hors d'Angular : zone.run met l'écran à jour.
    recognition.onresult = (event: SpeechRecognitionResultEvent) => this.zone.run(() => onText(this.transcriptOf(event)));
    recognition.onerror = (event: SpeechRecognitionErrorEvent) =>
      this.zone.run(() => this.error.set(ERROR_MESSAGES[event.error] ?? DEFAULT_ERROR));
    recognition.onend = () =>
      this.zone.run(() => {
        if (this.recognition === recognition) {
          this.recognition = null;
          this.listening.set(false);
        }
      });

    this.error.set(null);
    this.recognition = recognition;
    this.listening.set(true);
    recognition.start();
  }

  public stop(): void {
    this.recognition?.stop();
    this.recognition = null;
    this.listening.set(false);
  }

  private transcriptOf(event: SpeechRecognitionResultEvent): string {
    return Array.from(event.results, (result: ArrayLike<{ transcript: string }>) => result[0].transcript)
      .join('')
      .trim();
  }

  private findRecognitionClass(): SpeechRecognitionConstructor | undefined {
    const browser: BrowserWithSpeech = globalThis as unknown as BrowserWithSpeech;
    return browser.SpeechRecognition ?? browser.webkitSpeechRecognition;
  }
}
