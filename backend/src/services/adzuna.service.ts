import { env } from '../config/env.ts';
import { HttpError } from '../errors/http-error.ts';
import { OFFERS_PER_PAGE, type Offer, type OfferSearch } from '../models/offer.ts';

interface AdzunaJob {
  id: string;
  title: string;
  description?: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  contract_type?: string;
  salary_min?: number;
  salary_max?: number;
  redirect_url: string;
  created: string;
}

interface AdzunaSearchResponse {
  count: number;
  results: AdzunaJob[];
}

export interface AdzunaSearchResult {
  offers: Offer[];
  totalCount: number;
}

class AdzunaService {
  private readonly baseUrl: string = 'https://api.adzuna.com/v1/api/jobs/fr/search';
  private readonly timeoutMs: number = 10_000;

  public async search(search: OfferSearch): Promise<AdzunaSearchResult> {
    const params: URLSearchParams = new URLSearchParams({
      app_id: env.ADZUNA_APP_ID,
      app_key: env.ADZUNA_APP_KEY,
      what: search.job,
      where: search.city,
      results_per_page: String(OFFERS_PER_PAGE),
    });

    if (search.contract) {
      params.set(search.contract, '1');
    }

    const response: Response = await fetch(`${this.baseUrl}/${search.page}?${params.toString()}`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      throw new HttpError(502, `Adzuna a répondu ${response.status}`);
    }

    const body: AdzunaSearchResponse = (await response.json()) as AdzunaSearchResponse;

    return {
      offers: body.results.filter((job: AdzunaJob) => !this.isTestOffer(job)).map((job: AdzunaJob) => this.toOffer(job)),
      totalCount: body.count,
    };
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
      description: job.description ?? '',
      contractType: job.contract_type ?? null,
      salaryMin: job.salary_min ?? null,
      salaryMax: job.salary_max ?? null,
      url: job.redirect_url,
      createdAt: job.created,
    };
  }
}

export const adzunaService: AdzunaService = new AdzunaService();
