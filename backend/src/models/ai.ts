import { z } from 'zod';

export type AiProvider = 'gemini' | 'groq';

export const aiProviderChoiceSchema = z.enum(['auto', 'gemini', 'groq']);

export type AiProviderChoice = z.infer<typeof aiProviderChoiceSchema>;

export interface AiResponse<T> {
  provider: AiProvider;
  durationMs: number;
  data: T;
}

export interface JsonGenerator {
  generateJson(prompt: string, jsonSchema: Record<string, unknown>): Promise<unknown>;
}
