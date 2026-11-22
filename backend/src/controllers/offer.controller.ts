import type { Request, Response } from 'express';
import type { Offer, OfferPage, OfferSearch } from '../models/offer.ts';
import { offerService } from '../services/offer.service.ts';

type IdParams = { id: string };

export async function searchOffers(
  _req: Request,
  res: Response<OfferPage, { query: OfferSearch }>,
): Promise<void> {
  res.json(await offerService.search(res.locals.query));
}

export function getOffer(req: Request<IdParams>, res: Response<Offer>): void {
  res.json(offerService.findById(req.params.id));
}
