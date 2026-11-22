import { z, type ZodType } from 'zod';
import { HttpError } from '../errors/http-error.ts';
import type { AiProvider, JsonGenerator } from '../models/ai.ts';
import type { Offer } from '../models/offer.ts';
import {
  characterReplySchema,
  scenarioSchema,
  simulationResultSchema,
  type Character,
  type CharacterReply,
  type DayEvent,
  type Scenario,
  type SimulationResult,
} from '../models/scenario.ts';
import type { Simulation } from '../models/simulation.ts';
import { buildAnalysisPrompt, buildReplyPrompt, buildScenarioPrompt } from './ai-prompts.ts';
import { geminiService } from './gemini.service.ts';
import { groqService } from './groq.service.ts';

class AiService {
  private readonly generators: Record<AiProvider, JsonGenerator> = { gemini: geminiService, groq: groqService };

  public generateScenario(offer: Offer): Promise<Scenario> {
    return this.generate(buildScenarioPrompt(offer), scenarioSchema);
  }

  public replyAsCharacter(
    simulation: Simulation,
    event: DayEvent,
    character: Character,
    reply: string,
    timedOut: boolean,
  ): Promise<CharacterReply> {
    return this.generate(buildReplyPrompt(simulation, event, character, reply, timedOut), characterReplySchema);
  }

  public analyze(simulation: Simulation, gameOver: boolean): Promise<SimulationResult> {
    return this.generate(buildAnalysisPrompt(simulation, gameOver), simulationResultSchema);
  }

  /** Gemini est appelé en premier, et Groq prend le relais s'il échoue. */
  private async generate<T>(prompt: string, schema: ZodType<T>): Promise<T> {
    try {
      return await this.callProvider('gemini', prompt, schema);
    } catch (error: unknown) {
      console.warn(`Gemini indisponible, bascule sur Groq : ${error instanceof Error ? error.message : error}`);
      return this.callProvider('groq', prompt, schema);
    }
  }

  private async callProvider<T>(provider: AiProvider, prompt: string, schema: ZodType<T>): Promise<T> {
    const raw: unknown = await this.generators[provider].generateJson(prompt, z.toJSONSchema(schema));
    const parsed: z.ZodSafeParseResult<T> = schema.safeParse(raw);

    if (!parsed.success) {
      throw new HttpError(502, `La réponse de ${provider} n'a pas le format attendu`);
    }

    return parsed.data;
  }
}

export const aiService: AiService = new AiService();
