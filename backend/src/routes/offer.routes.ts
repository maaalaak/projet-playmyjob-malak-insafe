import { Router } from 'express';
import { getOffer, searchOffers } from '../controllers/offer.controller.ts';
import { validateQuery } from '../middlewares/validate.middleware.ts';
import { offerSearchSchema } from '../models/offer.ts';

export const offerRouter: Router = Router();

offerRouter.get('/', validateQuery(offerSearchSchema), searchOffers);
offerRouter.get('/:id', getOffer);
