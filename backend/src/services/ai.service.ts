import { z, type ZodType } from 'zod';
import { HttpError } from '../errors/http-error.ts';
import type { AiProvider, AiProviderChoice, AiResponse, JsonGenerator } from '../models/ai.ts';
import { characterReplySchema, dayScriptSchema, type CharacterReply, type DayScript } from '../models/day.ts';
import {
  simulationResultSchema,
  type AnalyzeDayRequest,
  type ReplyRequest,
  type SimulationResult,
} from '../models/simulation.ts';
import { buildAnalysisPrompt, buildDayPrompt, buildReplyPrompt } from './ai-prompts.ts';
import { geminiService } from './gemini.service.ts';
import { groqService } from './groq.service.ts';

class AiService {
  private readonly generators: Record<AiProvider, JsonGenerator> = { gemini: geminiService, groq: groqService };

  public generateDay(jobTitle: string, providerChoice: AiProviderChoice): Promise<AiResponse<DayScript>> {
    return this.generate(buildDayPrompt(jobTitle), dayScriptSchema, providerChoice);
  }

  public replyAsCharacter(request: ReplyRequest): Promise<AiResponse<CharacterReply>> {
    return this.generate(buildReplyPrompt(request), characterReplySchema, request.provider);
  }

  public analyzeDay(request: AnalyzeDayRequest): Promise<AiResponse<SimulationResult>> {
    return this.generate(buildAnalysisPrompt(request), simulationResultSchema, request.provider);
  }

  /** En mode « auto », Gemini est appelé en premier et Groq prend le relais s'il échoue. */
  private async generate<T>(prompt: string, schema: ZodType<T>, providerChoice: AiProviderChoice): Promise<AiResponse<T>> {
    if (providerChoice !== 'auto') {
      return this.callProvider(providerChoice, prompt, schema);
    }

    try {
      return await this.callProvider('gemini', prompt, schema);
    } catch (error: unknown) {
      console.warn(`Gemini indisponible, bascule sur Groq : ${error instanceof Error ? error.message : error}`);
      return this.callProvider('groq', prompt, schema);
    }
  }

  private async callProvider<T>(provider: AiProvider, prompt: string, schema: ZodType<T>): Promise<AiResponse<T>> {
    const startedAt: number = performance.now();
    const raw: unknown = await this.generators[provider].generateJson(prompt, z.toJSONSchema(schema));
    const parsed: z.ZodSafeParseResult<T> = schema.safeParse(raw);

    if (!parsed.success) {
      throw new HttpError(502, `La réponse de ${provider} n'a pas le format attendu`);
    }

    return { provider, durationMs: Math.round(performance.now() - startedAt), data: parsed.data };
  }
}

export const aiService: AiService = new AiService();
