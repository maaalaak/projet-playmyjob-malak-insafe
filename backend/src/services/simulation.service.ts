import { randomUUID } from 'node:crypto';
import { db } from '../data/db.ts';
import { HttpError } from '../errors/http-error.ts';
import type { Offer } from '../models/offer.ts';
import type { Character, CharacterReply, DayEvent, GaugeEffects, Scenario, SimulationResult } from '../models/scenario.ts';
import {
  INITIAL_GAUGE,
  type ContentSource,
  type Gauges,
  type PublicSimulation,
  type ReplyRequest,
  type Simulation,
} from '../models/simulation.ts';
import { aiService } from './ai.service.ts';
import { buildFallbackScenario, fallbackReply, fallbackResult } from './fallback-scenario.ts';
import { offerService } from './offer.service.ts';

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function applyEffects(gauges: Gauges, effects: GaugeEffects): Gauges {
  return {
    team: clamp(gauges.team + effects.team),
    client: clamp(gauges.client + effects.client),
    time: clamp(gauges.time + effects.time),
    quality: clamp(gauges.quality + effects.quality),
  };
}

function hasEmptyGauge(gauges: Gauges): boolean {
  return Object.values(gauges).some((value: number) => value === 0);
}

function warnFallback(step: string, error: unknown): void {
  console.warn(`IA indisponible (${step}), contenu de secours utilisé : ${error instanceof Error ? error.message : error}`);
}

class SimulationService {
  public async create(userId: string, offerId: string): Promise<PublicSimulation> {
    const offer: Offer = offerService.findById(offerId);
    let scenario: Scenario;
    let source: ContentSource = 'ia';

    try {
      scenario = await aiService.generateScenario(offer);
    } catch (error: unknown) {
      warnFallback('journée', error);
      scenario = buildFallbackScenario(offer);
      source = 'secours';
    }

    const simulation: Simulation = {
      id: randomUUID(),
      userId,
      offer,
      scenario,
      source,
      gauges: { team: INITIAL_GAUGE, client: INITIAL_GAUGE, time: INITIAL_GAUGE, quality: INITIAL_GAUGE },
      exchanges: [],
      status: 'playing',
      result: null,
      createdAt: new Date().toISOString(),
      finishedAt: null,
    };

    db.data.simulations.push(simulation);
    await db.write();

    return this.toPublic(simulation);
  }

  public async reply(userId: string, id: string, request: ReplyRequest): Promise<PublicSimulation> {
    const simulation: Simulation = this.findOwned(userId, id);

    if (simulation.status === 'finished' || this.isDayOver(simulation)) {
      throw new HttpError(409, 'Cette journée est déjà terminée');
    }

    const event: DayEvent = simulation.scenario.events[simulation.exchanges.length];
    const character: Character = simulation.scenario.characters.find((item: Character) => item.id === event.characterId)!;
    let reaction: CharacterReply;

    try {
      reaction = await aiService.replyAsCharacter(simulation, event, character, request.reply, request.timedOut);
    } catch (error: unknown) {
      warnFallback('réaction', error);
      reaction = fallbackReply(request.reply, request.timedOut, simulation.exchanges);
    }

    simulation.gauges = applyEffects(simulation.gauges, reaction.effects);
    simulation.exchanges.push({
      reply: request.reply,
      timedOut: request.timedOut,
      reaction: reaction.reply,
      mood: reaction.mood,
      skill: reaction.skill,
      effects: reaction.effects,
    });
    await db.write();

    return this.toPublic(simulation);
  }

  public async finish(userId: string, id: string): Promise<PublicSimulation> {
    const simulation: Simulation = this.findOwned(userId, id);

    if (simulation.status === 'finished') {
      return this.toPublic(simulation);
    }
    if (!this.isDayOver(simulation)) {
      throw new HttpError(409, "La journée n'est pas encore terminée");
    }

    const gameOver: boolean = hasEmptyGauge(simulation.gauges);
    let result: SimulationResult;

    try {
      result = await aiService.analyze(simulation, gameOver);
    } catch (error: unknown) {
      warnFallback('bilan', error);
      result = fallbackResult(simulation, gameOver);
    }

    simulation.result = result;
    simulation.status = 'finished';
    simulation.finishedAt = new Date().toISOString();
    await db.write();

    return this.toPublic(simulation);
  }

  public findAll(userId: string): PublicSimulation[] {
    return db.data.simulations
      .filter((simulation: Simulation) => simulation.userId === userId)
      .sort((a: Simulation, b: Simulation) => b.createdAt.localeCompare(a.createdAt))
      .map((simulation: Simulation) => this.toPublic(simulation));
  }

  public findById(userId: string, id: string): PublicSimulation {
    return this.toPublic(this.findOwned(userId, id));
  }

  public async remove(userId: string, id: string): Promise<void> {
    this.findOwned(userId, id);

    db.data.simulations = db.data.simulations.filter((simulation: Simulation) => simulation.id !== id);
    await db.write();
  }

  private findOwned(userId: string, id: string): Simulation {
    const simulation: Simulation | undefined = db.data.simulations.find(
      (item: Simulation) => item.id === id && item.userId === userId,
    );

    if (!simulation) {
      throw new HttpError(404, 'Simulation introuvable');
    }

    return simulation;
  }

  private isDayOver(simulation: Simulation): boolean {
    return simulation.exchanges.length >= simulation.scenario.events.length || hasEmptyGauge(simulation.gauges);
  }

  private toPublic(simulation: Simulation): PublicSimulation {
    const { userId: _userId, ...publicSimulation }: Simulation = simulation;
    return publicSimulation;
  }
}

export const simulationService: SimulationService = new SimulationService();
