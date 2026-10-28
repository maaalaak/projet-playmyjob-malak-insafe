import { Router } from 'express';
import {
  createFavorite,
  deleteFavorite,
  getFavorite,
  getFavorites,
  updateFavorite,
} from '../controllers/favorite.controller.ts';
import { validateBody } from '../middlewares/validate.middleware.ts';
import { createFavoriteSchema, updateFavoriteSchema } from '../models/favorite.ts';

export const favoriteRouter: Router = Router();

favoriteRouter.get('/', getFavorites);
favoriteRouter.get('/:id', getFavorite);
favoriteRouter.post('/', validateBody(createFavoriteSchema), createFavorite);
favoriteRouter.put('/:id', validateBody(updateFavoriteSchema), updateFavorite);
favoriteRouter.delete('/:id', deleteFavorite);
