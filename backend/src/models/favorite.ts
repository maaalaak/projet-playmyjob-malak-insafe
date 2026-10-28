import { z } from 'zod';
import { offerSchema, type Offer } from './offer.ts';

const noteSchema = z.string().trim().max(200);

export const createFavoriteSchema = z.object({
  offer: offerSchema,
  note: noteSchema.default(''),
});

export const updateFavoriteSchema = z.object({
  note: noteSchema,
});

export type CreateFavoriteRequest = z.infer<typeof createFavoriteSchema>;
export type UpdateFavoriteRequest = z.infer<typeof updateFavoriteSchema>;

export interface Favorite {
  id: string;
  offer: Offer;
  note: string;
  createdAt: string;
  updatedAt: string;
}
