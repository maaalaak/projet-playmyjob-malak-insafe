import type { Request, Response } from 'express';
import type { AuthLocals } from '../middlewares/auth.middleware.ts';
import type { CreateFavoriteRequest, PublicFavorite } from '../models/favorite.ts';
import { favoriteService } from '../services/favorite.service.ts';

type IdParams = { id: string };

export function getFavorites(_req: Request, res: Response<PublicFavorite[], AuthLocals>): void {
  res.json(favoriteService.findAll(res.locals.userId));
}

export async function createFavorite(
  req: Request<Record<string, never>, PublicFavorite, CreateFavoriteRequest>,
  res: Response<PublicFavorite, AuthLocals>,
): Promise<void> {
  res.status(201).json(await favoriteService.create(res.locals.userId, req.body.offer));
}

export async function deleteFavorite(req: Request<IdParams>, res: Response<unknown, AuthLocals>): Promise<void> {
  await favoriteService.remove(res.locals.userId, req.params.id);
  res.status(204).end();
}
