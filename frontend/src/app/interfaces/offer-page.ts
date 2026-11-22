import { Offer } from './offer';

export interface OfferPage {
  offers: Offer[];
  page: number;
  totalPages: number;
  totalCount: number;
}
