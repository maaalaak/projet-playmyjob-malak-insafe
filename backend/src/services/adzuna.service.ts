import { env } from '../config/env.ts';
import { HttpError } from '../errors/http-error.ts';
import type { Offer } from '../models/offer.ts';

interface AdzunaJob {
  id: string;
  title: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  contract_type?: string;
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
}

interface AdzunaSearchResponse {
  results: AdzunaJob[];
}

class AdzunaService {
  private readonly baseUrl: string = 'https://api.adzuna.com/v1/api/jobs/fr/search/1';
  private readonly timeoutMs: number = 10_000;
  private readonly maxResultsPerPage: number = 50;

  public async searchOffers(what: string, where: string, limit: number): Promise<Offer[]> {
    // On demande plus d'offres que nécessaire, car les fausses offres sont retirées ensuite.
    const params: URLSearchParams = new URLSearchParams({
      app_id: env.ADZUNA_APP_ID,
      app_key: env.ADZUNA_APP_KEY,
      what,
      where,
      results_per_page: String(Math.min(limit * 2, this.maxResultsPerPage)),
    });

    const response: Response = await fetch(`${this.baseUrl}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      throw new HttpError(502, `Adzuna a répondu ${response.status}`);
    }

    const body: AdzunaSearchResponse = (await response.json()) as AdzunaSearchResponse;

    return body.results
      .filter((job: AdzunaJob) => !this.isTestOffer(job))
      .slice(0, limit)
      .map((job: AdzunaJob) => this.toOffer(job));
  }

  private isTestOffer(job: AdzunaJob): boolean {
    return /\btest\b/i.test(job.company?.display_name ?? '');
  }

  private toOffer(job: AdzunaJob): Offer {
    return {
      id: job.id,
      title: job.title,
      company: job.company?.display_name ?? 'Entreprise non précisée',
      city: job.location?.display_name ?? 'Lieu non précisé',
      contractType: job.contract_type ?? null,
      salaryMin: job.salary_min ?? null,
      salaryMax: job.salary_max ?? null,
      url: job.redirect_url,
      createdAt: job.created,
    };
  }
}

export const adzunaService: AdzunaService = new AdzunaService();
