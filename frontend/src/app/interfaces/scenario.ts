export type Mood = 'content' | 'neutre' | 'inquiet' | 'agace';

export interface Character {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface ScenarioDocument {
  title: string;
  content: string;
}

export interface DayEvent {
  time: string;
  characterId: string;
  message: string;
  urgent: boolean;
  document: ScenarioDocument | null;
}

export interface Scenario {
  setting: string;
  intro: string;
  characters: Character[];
  events: DayEvent[];
}
