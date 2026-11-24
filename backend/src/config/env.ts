import { z } from 'zod';
import { AI_PROVIDERS } from '../models/ai.ts';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  /** L'IA appelée en premier : l'autre prend le relais si elle échoue. */
  AI_PRIMARY: z.enum(AI_PROVIDERS).default('gemini'),
  GEMINI_API_KEY: z.string().min(1),
  GEMINI_MODEL: z.string().min(1),
  GROQ_API_KEY: z.string().min(1),
  GROQ_MODEL: z.string().min(1),
  ADZUNA_APP_ID: z.string().min(1),
  ADZUNA_APP_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(32),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing: string[] = parsed.error.issues.map((issue) => issue.path.join('.'));
  console.error(`Variables manquantes ou invalides dans .env : ${missing.join(', ')}`);
  process.exit(1);
}

export const env: Env = parsed.data;
