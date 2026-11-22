import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.ts';
import { validateBody } from '../middlewares/validate.middleware.ts';
import { loginRequestSchema, registerRequestSchema } from '../models/user.ts';

export const authRouter: Router = Router();

authRouter.post('/register', validateBody(registerRequestSchema), register);
authRouter.post('/login', validateBody(loginRequestSchema), login);
