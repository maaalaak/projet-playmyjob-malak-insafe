import type { Request, Response } from 'express';
import type { AuthLocals } from '../middlewares/auth.middleware.ts';
import type { CreateSimulationRequest, PublicSimulation, ReplyRequest } from '../models/simulation.ts';
import { simulationService } from '../services/simulation.service.ts';

type IdParams = { id: string };
type NoParams = Record<string, never>;

export async function createSimulation(
  req: Request<NoParams, PublicSimulation, CreateSimulationRequest>,
  res: Response<PublicSimulation, AuthLocals>,
): Promise<void> {
  res.status(201).json(await simulationService.create(res.locals.userId, req.body.offerId));
}

export async function replyToSimulation(
  req: Request<IdParams, PublicSimulation, ReplyRequest>,
  res: Response<PublicSimulation, AuthLocals>,
): Promise<void> {
  res.json(await simulationService.reply(res.locals.userId, req.params.id, req.body));
}

export async function finishSimulation(req: Request<IdParams>, res: Response<PublicSimulation, AuthLocals>): Promise<void> {
  res.json(await simulationService.finish(res.locals.userId, req.params.id));
}

export function getSimulations(_req: Request, res: Response<PublicSimulation[], AuthLocals>): void {
  res.json(simulationService.findAll(res.locals.userId));
}

export function getSimulation(req: Request<IdParams>, res: Response<PublicSimulation, AuthLocals>): void {
  res.json(simulationService.findById(res.locals.userId, req.params.id));
}

export async function deleteSimulation(req: Request<IdParams>, res: Response<unknown, AuthLocals>): Promise<void> {
  await simulationService.remove(res.locals.userId, req.params.id);
  res.status(204).end();
}
