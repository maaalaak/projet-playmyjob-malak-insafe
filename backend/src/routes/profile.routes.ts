import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller.ts';
import { requireAuth } from '../middlewares/auth.middleware.ts';
import { validateBody } from '../middlewares/validate.middleware.ts';
import { updateProfileRequestSchema } from '../models/user.ts';

export const profileRouter: Router = Router();

profileRouter.use(requireAuth);

profileRouter.get('/', getProfile);
profileRouter.put('/', validateBody(updateProfileRequestSchema), updateProfile);
