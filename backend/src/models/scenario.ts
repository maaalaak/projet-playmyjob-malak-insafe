import { z } from 'zod';

export const CHARACTERS_PER_DAY: number = 3;
export const EVENTS_PER_DAY: number = 6;
export const MAX_GAUGE_EFFECT: number = 20;
export const MOODS = ['content', 'neutre', 'inquiet', 'agace'] as const;

export const characterSchema = z.object({
  id: z.string().min(1).max(20),
  name: z.string().min(1).max(30),
  role: z.string().min(1).max(60),
  avatar: z.string().min(1).max(16),
});

export const workDocumentSchema = z.object({
  title: z.string().min(1).max(80),
  content: z.string().min(1).max(600),
});

export const dayEventSchema = z.object({
  time: z.string().min(1).max(5),
  characterId: z.string().min(1),
  message: z.string().min(1).max(400),
  urgent: z.boolean(),
  document: workDocumentSchema.nullable(),
});

export const scenarioSchema = z
  .object({
    setting: z.string().min(1).max(100),
    intro: z.string().min(1).max(400),
    characters: z.array(characterSchema).length(CHARACTERS_PER_DAY),
    events: z.array(dayEventSchema).length(EVENTS_PER_DAY),
  })
  .refine(
    (scenario) =>
      scenario.events.every((event) => scenario.characters.some((character) => character.id === event.characterId)),
    { message: 'Chaque message doit venir d’un des personnages' },
  );

const gaugeEffectSchema = z.number().int().min(-MAX_GAUGE_EFFECT).max(MAX_GAUGE_EFFECT);

export const gaugeEffectsSchema = z.object({
  team: gaugeEffectSchema,
  client: gaugeEffectSchema,
  time: gaugeEffectSchema,
  quality: gaugeEffectSchema,
});

export const characterReplySchema = z.object({
  reply: z.string().min(1).max(400),
  mood: z.enum(MOODS),
  effects: gaugeEffectsSchema,
  skill: z.string().min(1).max(40),
});

export const simulationResultSchema = z.object({
  title: z.string().min(1).max(60),
  score: z.number().int().min(0).max(100),
  strengths: z.array(z.string().min(1)).min(1).max(3),
  advice: z.string().min(1).max(400),
});

export type Character = z.infer<typeof characterSchema>;
export type DayEvent = z.infer<typeof dayEventSchema>;
export type Scenario = z.infer<typeof scenarioSchema>;
export type Mood = (typeof MOODS)[number];
export type GaugeEffects = z.infer<typeof gaugeEffectsSchema>;
export type CharacterReply = z.infer<typeof characterReplySchema>;
export type SimulationResult = z.infer<typeof simulationResultSchema>;
