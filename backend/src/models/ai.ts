export type AiProvider = 'gemini' | 'groq';

export interface JsonGenerator {
  generateJson(prompt: string, jsonSchema: Record<string, unknown>): Promise<unknown>;
}
