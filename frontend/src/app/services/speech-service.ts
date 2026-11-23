import { Service, signal, WritableSignal } from '@angular/core';

const MUTED_KEY: string = 'playmyjob.voice-muted';
const LANGUAGE: string = 'fr-FR';
const SPEECH_RATE: number = 1.05;
/** Une hauteur de voix par personnage, pour qu'on les reconnaisse à l'oreille. */
const CHARACTER_PITCHES: readonly number[] = [1, 0.75, 1.25, 0.9, 1.15];
const EMOJIS: RegExp = /[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu;

@Service()
export class SpeechService {
  /** Faux si le navigateur ne sait pas lire un texte à voix haute. */
  public readonly isSupported: boolean = typeof speechSynthesis !== 'undefined';
  public readonly muted: WritableSignal<boolean> = signal<boolean>(this.readMuted());

  /** Ajoute le texte à la file de lecture : il sera lu après les phrases déjà en attente. */
  public speak(text: string, characterIndex: number): void {
    const cleanText: string = text.replace(EMOJIS, '').replace(/\s+/g, ' ').trim();
    if (!this.isSupported || this.muted() || !cleanText) {
      return;
    }

    const utterance: SpeechSynthesisUtterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = LANGUAGE;
    utterance.rate = SPEECH_RATE;
    utterance.pitch = CHARACTER_PITCHES[characterIndex % CHARACTER_PITCHES.length];
    utterance.voice = this.frenchVoice();

    speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (this.isSupported) {
      speechSynthesis.cancel();
    }
  }

  public toggleMuted(): void {
    const muted: boolean = !this.muted();
    this.muted.set(muted);
    localStorage.setItem(MUTED_KEY, String(muted));

    if (muted) {
      this.stop();
    }
  }

  private frenchVoice(): SpeechSynthesisVoice | null {
    return speechSynthesis.getVoices().find((voice: SpeechSynthesisVoice) => voice.lang.startsWith('fr')) ?? null;
  }

  private readMuted(): boolean {
    return localStorage.getItem(MUTED_KEY) === 'true';
  }
}
