import type { Request, Response } from 'express';
import type { CreateFavoriteRequest, Favorite, UpdateFavoriteRequest } from '../models/favorite.ts';
import { favoriteService } from '../services/favorite.service.ts';

type IdParams = { id: string };

export function getFavorites(_req: Request, res: Response<Favorite[]>): void {
  res.json(favoriteService.findAll());
}

export function getFavorite(req: Request<IdParams>, res: Response<Favorite>): void {
  res.json(favoriteService.findById(req.params.id));
}

export async function createFavorite(
  req: Request<Record<string, never>, Favorite, CreateFavoriteRequest>,
  res: Response<Favorite>,
): Promise<void> {
  res.status(201).json(await favoriteService.create(req.body));
}

export async function updateFavorite(
  req: Request<IdParams, Favorite, UpdateFavoriteRequest>,
  res: Response<Favorite>,
): Promise<void> {
  res.json(await favoriteService.update(req.params.id, req.body));
}

export async function deleteFavorite(req: Request<IdParams>, res: Response): Promise<void> {
  await favoriteService.remove(req.params.id);
  res.status(204).end();
}
