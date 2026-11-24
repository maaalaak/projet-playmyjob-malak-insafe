import { setTimeout as wait } from 'node:timers/promises';
import { z, type ZodType } from 'zod';
import { AiProviderError } from '../errors/ai-provider-error.ts';
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

const RETRY_DELAY_MS: number = 2_000;

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
      return await this.callWithRetry('gemini', prompt, schema);
    } catch (error: unknown) {
      console.warn(`Gemini indisponible, bascule sur Groq : ${error instanceof Error ? error.message : error}`);
      return this.callWithRetry('groq', prompt, schema);
    }
  }

  /** Une IA surchargée (429, 503…) l'est souvent pour quelques secondes : on lui laisse une seconde chance. */
  private async callWithRetry<T>(provider: AiProvider, prompt: string, schema: ZodType<T>): Promise<T> {
    try {
      return await this.callProvider(provider, prompt, schema);
    } catch (error: unknown) {
      if (!(error instanceof AiProviderError) || !error.temporary) {
        throw error;
      }

      console.warn(`${error.message}, nouvel essai dans ${RETRY_DELAY_MS / 1000} s`);
      await wait(RETRY_DELAY_MS);
      return this.callProvider(provider, prompt, schema);
    }
  }

  private async callProvider<T>(provider: AiProvider, prompt: string, schema: ZodType<T>): Promise<T> {
    const raw: unknown = await this.generators[provider].generateJson(prompt, z.toJSONSchema(schema));
    const parsed: z.ZodSafeParseResult<T> = schema.safeParse(raw);

    if (!parsed.success) {
      const issue: z.core.$ZodIssue | undefined = parsed.error.issues[0];
      const detail: string = issue ? ` (${issue.path.join('.') || 'racine'} : ${issue.message})` : '';
      throw new HttpError(502, `La réponse de ${provider} n'a pas le format attendu${detail}`);
    }

    return parsed.data;
  }
}

export const aiService: AiService = new AiService();
