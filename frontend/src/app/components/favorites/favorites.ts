import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, inject, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { Favorite } from '../../interfaces/favorite';
import { FavoriteService } from '../../services/favorite-service';
import { httpErrorMessage } from '../../utils/http-error-message';
import { EmptyState } from '../empty-state/empty-state';
import { ErrorMessage } from '../error-message/error-message';
import { Loader } from '../loader/loader';
import { OfferCard } from '../offer-card/offer-card';

@Component({
  imports: [MatButtonModule, RouterLink, EmptyState, ErrorMessage, Loader, OfferCard],
  selector: 'app-favorites',
  styleUrl: './favorites.scss',
  templateUrl: './favorites.html',
})
export class Favorites {
  private readonly favoriteService: FavoriteService = inject(FavoriteService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly favorites: Signal<Favorite[]> = this.favoriteService.favorites;
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly error: WritableSignal<string | null> = signal<string | null>(null);

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.favoriteService
      .load()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.loading.set(false),
        error: (error: HttpErrorResponse) => {
          this.error.set(httpErrorMessage(error));
          this.loading.set(false);
        },
      });
  }
}
