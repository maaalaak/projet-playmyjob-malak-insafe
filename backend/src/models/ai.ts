export const AI_PROVIDERS = ['gemini', 'groq'] as const;

export type AiProvider = (typeof AI_PROVIDERS)[number];

export interface JsonGenerator {
  generateJson(prompt: string, jsonSchema: Record<string, unknown>): Promise<unknown>;
}
