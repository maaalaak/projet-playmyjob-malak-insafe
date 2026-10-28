import { z } from 'zod';

export const offerSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  company: z.string(),
  city: z.string(),
  contractType: z.string().nullable(),
  salaryMin: z.number().nullable(),
  salaryMax: z.number().nullable(),
  url: z.url(),
  createdAt: z.string(),
});

export type Offer = z.infer<typeof offerSchema>;
