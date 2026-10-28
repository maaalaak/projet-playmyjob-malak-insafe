import { Router } from 'express';
import { analyzeTestDay, replyInTestDay, startTestDay } from '../controllers/simulation-test.controller.ts';
import { validateBody } from '../middlewares/validate.middleware.ts';
import { analyzeDayRequestSchema, replyRequestSchema, startDayRequestSchema } from '../models/simulation.ts';

export const simulationTestRouter: Router = Router();

simulationTestRouter.post('/day', validateBody(startDayRequestSchema), startTestDay);
simulationTestRouter.post('/reply', validateBody(replyRequestSchema), replyInTestDay);
simulationTestRouter.post('/analysis', validateBody(analyzeDayRequestSchema), analyzeTestDay);
