import { Offer } from './offer';
import { Mood, Scenario } from './scenario';

export interface Gauges {
  team: number;
  client: number;
  time: number;
  quality: number;
}

export type GaugeEffects = Gauges;

export interface Exchange {
  reply: string;
  timedOut: boolean;
  reaction: string;
  mood: Mood;
  skill: string;
  effects: GaugeEffects;
}

export interface SimulationResult {
  title: string;
  score: number;
  strengths: string[];
  advice: string;
}

export interface Simulation {
  id: string;
  offer: Offer;
  scenario: Scenario;
  source: 'ia' | 'secours';
  gauges: Gauges;
  exchanges: Exchange[];
  status: 'playing' | 'finished';
  result: SimulationResult | null;
  createdAt: string;
  finishedAt: string | null;
}
