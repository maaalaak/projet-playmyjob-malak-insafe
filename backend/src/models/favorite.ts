import { z } from 'zod';
import { offerSchema, type Offer } from './offer.ts';

export const createFavoriteSchema = z.object({
  offer: offerSchema,
});

export type CreateFavoriteRequest = z.infer<typeof createFavoriteSchema>;

export interface Favorite {
  id: string;
  userId: string;
  offer: Offer;
  createdAt: string;
}

export type PublicFavorite = Omit<Favorite, 'userId'>;
