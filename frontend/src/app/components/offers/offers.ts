import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, map, merge, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { OfferPage } from '../../interfaces/offer-page';
import { ContractType, OfferSearch } from '../../interfaces/offer-search';
import { OfferSearchForm } from '../../interfaces/offer-search-form';
import { OfferService } from '../../services/offer-service';
import { EmptyState } from '../empty-state/empty-state';
import { ErrorMessage } from '../error-message/error-message';
import { Loader } from '../loader/loader';
import { OfferCard } from '../offer-card/offer-card';
import { httpErrorMessage } from '../../utils/http-error-message';

const CONTRACT_TYPES: readonly ContractType[] = ['permanent', 'contract'];

function isContractType(value: string | null): value is ContractType {
  return CONTRACT_TYPES.includes(value as ContractType);
}

@Component({
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    EmptyState,
    ErrorMessage,
    Loader,
    OfferCard,
  ],
  selector: 'app-offers',
  styleUrl: './offers.scss',
  templateUrl: './offers.html',
})
export class Offers {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private readonly offerService: OfferService = inject(OfferService);
  private readonly retries: Subject<void> = new Subject<void>();

  protected readonly contractOptions: readonly { value: ContractType | null; label: string }[] = [
    { value: null, label: 'Tous les contrats' },
    { value: 'permanent', label: 'CDI' },
    { value: 'contract', label: 'CDD' },
  ];

  protected readonly search: WritableSignal<OfferSearch | null> = signal<OfferSearch | null>(null);
  protected readonly result: WritableSignal<OfferPage | null> = signal<OfferPage | null>(null);
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly error: WritableSignal<string | null> = signal<string | null>(null);

  protected readonly form: FormGroup<OfferSearchForm> = new FormGroup<OfferSearchForm>({
    job: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(100)] }),
    city: new FormControl<string>('', { nonNullable: true, validators: [Validators.maxLength(100)] }),
    contract: new FormControl<ContractType | null>(null),
  });

  constructor() {
    const searchesFromUrl: Observable<OfferSearch | null> = this.route.queryParamMap.pipe(
      map((params: ParamMap) => this.readSearch(params)),
    );
    const retriedSearches: Observable<OfferSearch | null> = this.retries.pipe(map(() => this.search()));

    merge(searchesFromUrl, retriedSearches)
      .pipe(
        tap((search: OfferSearch | null) => this.startSearch(search)),
        switchMap((search: OfferSearch | null) => (search ? this.fetchPage(search) : of(null))),
        takeUntilDestroyed(),
      )
      .subscribe((result: OfferPage | null) => {
        this.result.set(result);
        this.loading.set(false);
      });
  }

  protected submit(): void {
    if (this.form.invalid) {
      return;
    }

    const { job, city, contract } = this.form.getRawValue();
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { job: job.trim(), city: city.trim() || null, contract },
    });
  }

  protected goToPage(page: number): void {
    void this.router.navigate([], { relativeTo: this.route, queryParams: { page }, queryParamsHandling: 'merge' });
  }

  protected retry(): void {
    this.retries.next();
  }

  private startSearch(search: OfferSearch | null): void {
    this.search.set(search);
    this.error.set(null);
    this.loading.set(search !== null);

    if (search) {
      this.form.setValue({ job: search.job, city: search.city, contract: search.contract });
    }
  }

  private fetchPage(search: OfferSearch): Observable<OfferPage | null> {
    return this.offerService.search(search).pipe(
      catchError((error: HttpErrorResponse) => {
        this.error.set(httpErrorMessage(error));
        return of(null);
      }),
    );
  }

  private readSearch(params: ParamMap): OfferSearch | null {
    const job: string = params.get('job')?.trim() ?? '';

    if (!job) {
      return null;
    }

    const contract: string | null = params.get('contract');
    return {
      job,
      city: params.get('city')?.trim() ?? '',
      contract: isContractType(contract) ? contract : null,
      page: Math.max(1, Number(params.get('page')) || 1),
    };
  }
}
