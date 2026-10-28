import { JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';
import { ApiName, ApiTestDefinition, ApiTestState } from '../../interfaces/api-test';
import { Offer } from '../../interfaces/offer';
import { DayScript } from '../../interfaces/simulation';
import { ApiTestService } from '../../services/api-test-service';
import { httpErrorMessage } from '../../shared/utils/http-error-message';

const INITIAL_STATE: ApiTestState = { loading: false, durationMs: null, data: null, error: null };

@Component({
  imports: [JsonPipe],
  selector: 'app-api-test',
  styleUrl: './api-test.scss',
  templateUrl: './api-test.html',
})
export class ApiTest {
  private readonly apiTestService: ApiTestService = inject(ApiTestService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly tests: readonly ApiTestDefinition[] = [
    { name: 'gemini', label: 'Gemini', description: "IA principale : journée d'un Product Owner" },
    { name: 'groq', label: 'Groq', description: "IA de secours : journée d'un Product Owner" },
    { name: 'adzuna', label: 'Adzuna', description: 'Offres de développeur à Paris' },
  ];

  protected readonly states: WritableSignal<Record<ApiName, ApiTestState>> = signal({
    gemini: INITIAL_STATE,
    groq: INITIAL_STATE,
    adzuna: INITIAL_STATE,
  });

  protected run(name: ApiName): void {
    const startedAt: number = performance.now();
    this.setState(name, { ...INITIAL_STATE, loading: true });

    this.requestFor(name)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: DayScript | Offer[]) =>
          this.setState(name, { ...INITIAL_STATE, data, durationMs: this.elapsedSince(startedAt) }),
        error: (error: HttpErrorResponse) =>
          this.setState(name, {
            ...INITIAL_STATE,
            error: httpErrorMessage(error),
            durationMs: this.elapsedSince(startedAt),
          }),
      });
  }

  private requestFor(name: ApiName): Observable<DayScript | Offer[]> {
    switch (name) {
      case 'gemini':
        return this.apiTestService.testGemini();
      case 'groq':
        return this.apiTestService.testGroq();
      case 'adzuna':
        return this.apiTestService.testAdzuna();
    }
  }

  private setState(name: ApiName, state: ApiTestState): void {
    this.states.update((states: Record<ApiName, ApiTestState>) => ({ ...states, [name]: state }));
  }

  private elapsedSince(startedAt: number): number {
    return Math.round(performance.now() - startedAt);
  }
}
