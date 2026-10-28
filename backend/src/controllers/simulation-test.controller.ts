import type { Request, Response } from 'express';
import type { AiResponse } from '../models/ai.ts';
import type { CharacterReply, DayScript } from '../models/day.ts';
import type { AnalyzeDayRequest, ReplyRequest, SimulationResult, StartDayRequest } from '../models/simulation.ts';
import { aiService } from '../services/ai.service.ts';

type NoParams = Record<string, never>;

export async function startTestDay(
  req: Request<NoParams, AiResponse<DayScript>, StartDayRequest>,
  res: Response<AiResponse<DayScript>>,
): Promise<void> {
  res.json(await aiService.generateDay(req.body.jobTitle, req.body.provider));
}

export async function replyInTestDay(
  req: Request<NoParams, AiResponse<CharacterReply>, ReplyRequest>,
  res: Response<AiResponse<CharacterReply>>,
): Promise<void> {
  res.json(await aiService.replyAsCharacter(req.body));
}

export async function analyzeTestDay(
  req: Request<NoParams, AiResponse<SimulationResult>, AnalyzeDayRequest>,
  res: Response<AiResponse<SimulationResult>>,
): Promise<void> {
  res.json(await aiService.analyzeDay(req.body));
}
