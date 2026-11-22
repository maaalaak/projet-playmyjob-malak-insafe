import { Offer } from './offer';

export interface Favorite {
  id: string;
  offer: Offer;
  createdAt: string;
}
