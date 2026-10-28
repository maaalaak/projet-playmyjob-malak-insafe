import { env } from '../config/env.ts';
import { HttpError } from '../errors/http-error.ts';
import type { JsonGenerator } from '../models/ai.ts';

interface GeminiResponse {
  candidates?: { content: { parts: { text: string }[] } }[];
}

class GeminiService implements JsonGenerator {
  private readonly baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models';
  private readonly timeoutMs: number = 20_000;

  public async generateJson(prompt: string, jsonSchema: Record<string, unknown>): Promise<unknown> {
    const response: Response = await fetch(`${this.baseUrl}/${env.GEMINI_MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json', responseJsonSchema: jsonSchema },
      }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      throw new HttpError(502, `Gemini a répondu ${response.status}`);
    }

    const body: GeminiResponse = (await response.json()) as GeminiResponse;
    const text: string | undefined = body.candidates?.[0]?.content.parts[0]?.text;

    if (!text) {
      throw new HttpError(502, 'Gemini a renvoyé une réponse vide');
    }

    try {
      return JSON.parse(text);
    } catch {
      throw new HttpError(502, 'Gemini a renvoyé un JSON invalide');
    }
  }
}

export const geminiService: GeminiService = new GeminiService();
