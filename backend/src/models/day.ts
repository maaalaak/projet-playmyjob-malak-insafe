import { z } from 'zod';

export const CHARACTERS_PER_DAY: number = 3;
export const EVENTS_PER_DAY: number = 6;
export const MAX_GAUGE_EFFECT: number = 20;

export const characterSchema = z.object({
  id: z.string().min(1).max(20),
  name: z.string().min(1).max(30),
  role: z.string().min(1).max(60),
  avatar: z.string().min(1).max(16),
});

export const dayEventSchema = z.object({
  time: z.string().min(1).max(5),
  characterId: z.string().min(1),
  message: z.string().min(1).max(400),
  urgent: z.boolean(),
});

export const dayScriptSchema = z
  .object({
    characters: z.array(characterSchema).length(CHARACTERS_PER_DAY),
    events: z.array(dayEventSchema).length(EVENTS_PER_DAY),
  })
  .refine(
    (script) => script.events.every((event) => script.characters.some((character) => character.id === event.characterId)),
    { message: 'Chaque message doit venir d’un des personnages' },
  );

const gaugeValueSchema = z.number().int().min(0).max(100);
const gaugeEffectSchema = z.number().int().min(-MAX_GAUGE_EFFECT).max(MAX_GAUGE_EFFECT);

export const gaugesSchema = z.object({
  team: gaugeValueSchema,
  client: gaugeValueSchema,
  time: gaugeValueSchema,
  quality: gaugeValueSchema,
});

export const gaugeEffectsSchema = z.object({
  team: gaugeEffectSchema,
  client: gaugeEffectSchema,
  time: gaugeEffectSchema,
  quality: gaugeEffectSchema,
});

export const characterReplySchema = z.object({
  reply: z.string().min(1).max(400),
  effects: gaugeEffectsSchema,
  skill: z.string().min(1).max(40),
});

export type Character = z.infer<typeof characterSchema>;
export type DayEvent = z.infer<typeof dayEventSchema>;
export type DayScript = z.infer<typeof dayScriptSchema>;
export type Gauges = z.infer<typeof gaugesSchema>;
export type GaugeEffects = z.infer<typeof gaugeEffectsSchema>;
export type CharacterReply = z.infer<typeof characterReplySchema>;
