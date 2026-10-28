import { Router } from 'express';
import { testAdzuna, testGemini, testGroq } from '../controllers/api-test.controller.ts';

export const apiTestRouter: Router = Router();

apiTestRouter.get('/gemini', testGemini);
apiTestRouter.get('/groq', testGroq);
apiTestRouter.get('/adzuna', testAdzuna);
