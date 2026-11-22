import { Router } from 'express';
import {
  createSimulation,
  deleteSimulation,
  finishSimulation,
  getSimulation,
  getSimulations,
  replyToSimulation,
} from '../controllers/simulation.controller.ts';
import { requireAuth } from '../middlewares/auth.middleware.ts';
import { validateBody } from '../middlewares/validate.middleware.ts';
import { createSimulationRequestSchema, replyRequestSchema } from '../models/simulation.ts';

export const simulationRouter: Router = Router();

simulationRouter.use(requireAuth);

simulationRouter.post('/', validateBody(createSimulationRequestSchema), createSimulation);
simulationRouter.get('/', getSimulations);
simulationRouter.get('/:id', getSimulation);
simulationRouter.delete('/:id', deleteSimulation);
simulationRouter.post('/:id/replies', validateBody(replyRequestSchema), replyToSimulation);
simulationRouter.post('/:id/finish', finishSimulation);
