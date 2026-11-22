import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { catchError, map, merge, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { Offer } from '../../interfaces/offer';
import { ContractLabelPipe } from '../../pipes/contract-label-pipe';
import { SalaryRangePipe } from '../../pipes/salary-range-pipe';
import { OfferService } from '../../services/offer-service';
import { httpErrorMessage } from '../../utils/http-error-message';
import { ErrorMessage } from '../error-message/error-message';
import { FavoriteButton } from '../favorite-button/favorite-button';
import { Loader } from '../loader/loader';

@Component({
  imports: [MatButtonModule, RouterLink, ErrorMessage, FavoriteButton, Loader, ContractLabelPipe, SalaryRangePipe],
  selector: 'app-offer-detail',
  styleUrl: './offer-detail.scss',
  templateUrl: './offer-detail.html',
})
export class OfferDetail {
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly offerService: OfferService = inject(OfferService);
  private readonly retries: Subject<void> = new Subject<void>();
  private offerId: string = '';

  protected readonly offer: WritableSignal<Offer | null> = signal<Offer | null>(null);
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly error: WritableSignal<string | null> = signal<string | null>(null);

  constructor() {
    const idsFromUrl: Observable<string> = this.route.paramMap.pipe(map((params: ParamMap) => params.get('id') ?? ''));
    const retriedIds: Observable<string> = this.retries.pipe(map(() => this.offerId));

    merge(idsFromUrl, retriedIds)
      .pipe(
        tap((id: string) => this.startLoading(id)),
        switchMap((id: string) => this.fetchOffer(id)),
        takeUntilDestroyed(),
      )
      .subscribe((offer: Offer | null) => {
        this.offer.set(offer);
        this.loading.set(false);
      });
  }

  protected retry(): void {
    this.retries.next();
  }

  private startLoading(id: string): void {
    this.offerId = id;
    this.error.set(null);
    this.loading.set(true);
  }

  private fetchOffer(id: string): Observable<Offer | null> {
    return this.offerService.findById(id).pipe(
      catchError((error: HttpErrorResponse) => {
        this.error.set(httpErrorMessage(error));
        return of(null);
      }),
    );
  }
}
