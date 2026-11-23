/**
 * La reconnaissance vocale du navigateur (Chrome la propose sous le nom webkitSpeechRecognition).
 * TypeScript ne la connaît pas encore : on décrit ici seulement ce que l'application utilise.
 */
export interface SpeechRecognitionResultEvent {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
}

export interface SpeechRecognitionErrorEvent {
  error: string;
}

export interface SpeechRecognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

export type SpeechRecognitionConstructor = new () => SpeechRecognition;
