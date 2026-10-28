import { env } from '../config/env.ts';
import { HttpError } from '../errors/http-error.ts';
import type { JsonGenerator } from '../models/ai.ts';

interface GroqResponse {
  choices?: { message: { content: string } }[];
}

class GroqService implements JsonGenerator {
  private readonly url: string = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly timeoutMs: number = 15_000;

  public async generateJson(prompt: string, jsonSchema: Record<string, unknown>): Promise<unknown> {
    const response: Response = await fetch(this.url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${env.GROQ_API_KEY}` },
      body: JSON.stringify({
        model: env.GROQ_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: `Réponds uniquement avec un objet JSON qui respecte ce schéma : ${JSON.stringify(jsonSchema)}`,
          },
          { role: 'user', content: prompt },
        ],
      }),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      throw new HttpError(502, `Groq a répondu ${response.status}`);
    }

    const body: GroqResponse = (await response.json()) as GroqResponse;
    const content: string | undefined = body.choices?.[0]?.message.content;

    if (!content) {
      throw new HttpError(502, 'Groq a renvoyé une réponse vide');
    }

    try {
      return JSON.parse(content);
    } catch {
      throw new HttpError(502, 'Groq a renvoyé un JSON invalide');
    }
  }
}

export const groqService: GroqService = new GroqService();
