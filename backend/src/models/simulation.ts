import { z } from 'zod';
import type { Offer } from './offer.ts';
import type { GaugeEffects, Mood, Scenario, SimulationResult } from './scenario.ts';

export const INITIAL_GAUGE: number = 60;
const REPLY_MAX_LENGTH: number = 500;

export const createSimulationRequestSchema = z.object({
  offerId: z.string().min(1),
});

export const replyRequestSchema = z
  .object({
    reply: z.string().trim().max(REPLY_MAX_LENGTH),
    timedOut: z.boolean(),
  })
  .refine((request) => request.timedOut || request.reply.length > 0, {
    message: 'La réponse est vide',
    path: ['reply'],
  });

export type CreateSimulationRequest = z.infer<typeof createSimulationRequestSchema>;
export type ReplyRequest = z.infer<typeof replyRequestSchema>;

export interface Gauges {
  team: number;
  client: number;
  time: number;
  quality: number;
}

export interface Exchange {
  reply: string;
  timedOut: boolean;
  reaction: string;
  mood: Mood;
  skill: string;
  effects: GaugeEffects;
}

export type SimulationStatus = 'playing' | 'finished';
export type ContentSource = 'ia' | 'secours';

export interface Simulation {
  id: string;
  userId: string;
  offer: Offer;
  scenario: Scenario;
  source: ContentSource;
  gauges: Gauges;
  exchanges: Exchange[];
  status: SimulationStatus;
  result: SimulationResult | null;
  createdAt: string;
  finishedAt: string | null;
}

export type PublicSimulation = Omit<Simulation, 'userId'>;
