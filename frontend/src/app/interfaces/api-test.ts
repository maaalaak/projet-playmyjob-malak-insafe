import { Offer } from './offer';
import { DayScript } from './simulation';

export type ApiName = 'gemini' | 'groq' | 'adzuna';

export interface ApiTestDefinition {
  name: ApiName;
  label: string;
  description: string;
}

export interface ApiTestState {
  loading: boolean;
  durationMs: number | null;
  data: DayScript | Offer[] | null;
  error: string | null;
}
