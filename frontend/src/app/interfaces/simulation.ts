export type JobTitle = 'Product Owner' | 'Développeur' | 'Data Analyst' | 'UX Designer';

export type AiProvider = 'gemini' | 'groq';

export type AiProviderChoice = 'auto' | AiProvider;

export type SimulationStep = 'setup' | 'generating' | 'playing' | 'analyzing' | 'result';

export interface AiResponse<T> {
  provider: AiProvider;
  durationMs: number;
  data: T;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface DayEvent {
  time: string;
  characterId: string;
  message: string;
  urgent: boolean;
}

export interface DayScript {
  characters: Character[];
  events: DayEvent[];
}

export type GaugeKey = 'team' | 'client' | 'time' | 'quality';

export type Gauges = Record<GaugeKey, number>;

export type GaugeEffects = Record<GaugeKey, number>;

export interface GaugeDefinition {
  key: GaugeKey;
  label: string;
  emoji: string;
  gameOverMessage: string;
}

export interface CharacterReply {
  reply: string;
  effects: GaugeEffects;
  skill: string;
}

export interface Exchange {
  characterRole: string;
  message: string;
  playerReply: string;
  timedOut: boolean;
  reaction: string;
  skill: string;
  effects: GaugeEffects;
}

export interface SimulationResult {
  title: string;
  score: number;
  strengths: string[];
  advice: string;
}

export type ChatMessageKind = 'character' | 'player' | 'system';

export interface ChatMessage {
  id: number;
  kind: ChatMessageKind;
  characterId: string | null;
  text: string;
  time: string;
  skill: string | null;
}

export interface StartDayRequest {
  jobTitle: JobTitle;
  provider: AiProviderChoice;
}

export interface ReplyRequest {
  jobTitle: JobTitle;
  provider: AiProviderChoice;
  character: Character;
  event: DayEvent;
  playerReply: string;
  timedOut: boolean;
  gauges: Gauges;
}

export interface AnalyzeDayRequest {
  jobTitle: JobTitle;
  provider: AiProviderChoice;
  exchanges: Exchange[];
  gauges: Gauges;
  gameOver: boolean;
}
