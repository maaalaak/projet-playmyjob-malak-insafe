import type { Request, Response } from 'express';
import type { DayScript } from '../models/day.ts';
import type { Offer } from '../models/offer.ts';
import { adzunaService } from '../services/adzuna.service.ts';
import { aiService } from '../services/ai.service.ts';

const TEST_JOB: string = 'Product Owner';

export async function testGemini(_req: Request, res: Response<DayScript>): Promise<void> {
  res.json((await aiService.generateDay(TEST_JOB, 'gemini')).data);
}

export async function testGroq(_req: Request, res: Response<DayScript>): Promise<void> {
  res.json((await aiService.generateDay(TEST_JOB, 'groq')).data);
}

export async function testAdzuna(_req: Request, res: Response<Offer[]>): Promise<void> {
  res.json(await adzunaService.searchOffers('developpeur', 'Paris', 10));
}
