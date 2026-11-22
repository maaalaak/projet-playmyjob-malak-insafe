import { Router } from 'express';
import { createFavorite, deleteFavorite, getFavorites } from '../controllers/favorite.controller.ts';
import { requireAuth } from '../middlewares/auth.middleware.ts';
import { validateBody } from '../middlewares/validate.middleware.ts';
import { createFavoriteSchema } from '../models/favorite.ts';

export const favoriteRouter: Router = Router();

favoriteRouter.use(requireAuth);

favoriteRouter.get('/', getFavorites);
favoriteRouter.post('/', validateBody(createFavoriteSchema), createFavorite);
favoriteRouter.delete('/:id', deleteFavorite);
