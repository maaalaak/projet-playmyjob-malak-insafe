import { z } from 'zod';

export const CONTRACT_TYPES = ['permanent', 'contract'] as const;
export const OFFERS_PER_PAGE: number = 20;

export const offerSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  company: z.string(),
  city: z.string(),
  description: z.string().default(''),
  contractType: z.string().nullable(),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  url: z.url(),
  createdAt: z.string(),
});

export const offerSearchSchema = z.object({
  job: z.string().trim().min(1).max(100),
  city: z.string().trim().max(100).default(''),
  contract: z.enum(CONTRACT_TYPES).optional(),
  page: z.coerce.number().int().min(1).max(50).default(1),
});

export type Offer = z.infer<typeof offerSchema>;
export type ContractType = (typeof CONTRACT_TYPES)[number];
export type OfferSearch = z.infer<typeof offerSearchSchema>;

export interface OfferPage {
  offers: Offer[];
  page: number;
  totalPages: number;
  totalCount: number;
}
