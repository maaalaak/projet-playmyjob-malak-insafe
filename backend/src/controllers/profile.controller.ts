import type { Request, Response } from 'express';
import type { AuthLocals } from '../middlewares/auth.middleware.ts';
import type { PublicUser, UpdateProfileRequest } from '../models/user.ts';
import { profileService } from '../services/profile.service.ts';

export function getProfile(_req: Request, res: Response<PublicUser, AuthLocals>): void {
  res.json(profileService.findById(res.locals.userId));
}

export async function updateProfile(
  req: Request<Record<string, never>, PublicUser, UpdateProfileRequest>,
  res: Response<PublicUser, AuthLocals>,
): Promise<void> {
  res.json(await profileService.update(res.locals.userId, req.body));
}
