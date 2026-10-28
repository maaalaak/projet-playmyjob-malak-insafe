import { Offer } from './offer';

export interface Favorite {
  id: string;
  offer: Offer;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFavoriteRequest {
  offer: Offer;
  note?: string;
}

export interface UpdateFavoriteRequest {
  note: string;
}
