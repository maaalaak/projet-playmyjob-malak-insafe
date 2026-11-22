import { HttpError } from '../errors/http-error.ts';
import { OFFERS_PER_PAGE, type Offer, type OfferPage, type OfferSearch } from '../models/offer.ts';
import { adzunaService, type AdzunaSearchResult } from './adzuna.service.ts';

const MAX_PAGES: number = 50;
const MAX_CACHED_OFFERS: number = 1000;

class OfferService {
  // Adzuna ne permet pas de lire une offre par son identifiant : on garde celles déjà trouvées.
  private readonly cache: Map<string, Offer> = new Map<string, Offer>();

  public async search(search: OfferSearch): Promise<OfferPage> {
    const result: AdzunaSearchResult = await adzunaService.search(search);
    result.offers.forEach((offer: Offer) => this.remember(offer));

    return {
      offers: result.offers,
      page: search.page,
      totalPages: Math.min(Math.ceil(result.totalCount / OFFERS_PER_PAGE), MAX_PAGES),
      totalCount: result.totalCount,
    };
  }

  public findById(id: string): Offer {
    const offer: Offer | undefined = this.cache.get(id);

    if (!offer) {
      throw new HttpError(404, "Cette offre n'est plus disponible, relance ta recherche");
    }

    return offer;
  }

  private remember(offer: Offer): void {
    this.cache.delete(offer.id);
    this.cache.set(offer.id, offer);

    if (this.cache.size > MAX_CACHED_OFFERS) {
      const oldestId: string | undefined = this.cache.keys().next().value;
      if (oldestId) {
        this.cache.delete(oldestId);
      }
    }
  }
}

export const offerService: OfferService = new OfferService();
