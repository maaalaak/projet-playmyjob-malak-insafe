import { z } from 'zod';
import { aiProviderChoiceSchema } from './ai.ts';
import { characterSchema, dayEventSchema, EVENTS_PER_DAY, gaugeEffectsSchema, gaugesSchema } from './day.ts';

export const JOB_TITLES = ['Product Owner', 'Développeur', 'Data Analyst', 'UX Designer'] as const;

export const jobTitleSchema = z.enum(JOB_TITLES);

export const startDayRequestSchema = z.object({
  jobTitle: jobTitleSchema,
  provider: aiProviderChoiceSchema.default('auto'),
});

export const replyRequestSchema = z.object({
  jobTitle: jobTitleSchema,
  provider: aiProviderChoiceSchema.default('auto'),
  character: characterSchema,
  event: dayEventSchema,
  playerReply: z.string().trim().max(500),
  timedOut: z.boolean(),
  gauges: gaugesSchema,
});

export const exchangeSchema = z.object({
  characterRole: z.string().min(1),
  message: z.string().min(1),
  playerReply: z.string().max(500),
  timedOut: z.boolean(),
  reaction: z.string().min(1),
  skill: z.string().min(1),
  effects: gaugeEffectsSchema,
});

export const analyzeDayRequestSchema = z.object({
  jobTitle: jobTitleSchema,
  provider: aiProviderChoiceSchema.default('auto'),
  exchanges: z.array(exchangeSchema).min(1).max(EVENTS_PER_DAY),
  gauges: gaugesSchema,
  gameOver: z.boolean(),
});

export const simulationResultSchema = z.object({
  title: z.string().min(1).max(60),
  score: z.number().int().min(0).max(100),
  strengths: z.array(z.string().min(1)).min(1).max(3),
  advice: z.string().min(1),
});

export type JobTitle = z.infer<typeof jobTitleSchema>;
export type StartDayRequest = z.infer<typeof startDayRequestSchema>;
export type ReplyRequest = z.infer<typeof replyRequestSchema>;
export type Exchange = z.infer<typeof exchangeSchema>;
export type AnalyzeDayRequest = z.infer<typeof analyzeDayRequestSchema>;
export type SimulationResult = z.infer<typeof simulationResultSchema>;
