import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Favorite } from '../../interfaces/favorite';
import { Offer } from '../../interfaces/offer';
import { ApiTestService } from '../../services/api-test-service';
import { FavoriteService } from '../../services/favorite-service';
import { httpErrorMessage } from '../../shared/utils/http-error-message';
import { FavoriteItem } from './favorite-item/favorite-item';

@Component({
  imports: [FavoriteItem],
  selector: 'app-crud-test',
  styleUrl: './crud-test.scss',
  templateUrl: './crud-test.html',
})
export class CrudTest implements OnInit {
  private readonly favoriteService: FavoriteService = inject(FavoriteService);
  private readonly apiTestService: ApiTestService = inject(ApiTestService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly offers: WritableSignal<Offer[]> = signal<Offer[]>([]);
  protected readonly favorites: WritableSignal<Favorite[]> = signal<Favorite[]>([]);
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly lastAction: WritableSignal<string | null> = signal<string | null>(null);
  protected readonly error: WritableSignal<string | null> = signal<string | null>(null);

  private readonly favoriteOfferIds: Signal<Set<string>> = computed(
    () => new Set(this.favorites().map((favorite: Favorite) => favorite.offer.id)),
  );

  public ngOnInit(): void {
    this.loadFavorites();
  }

  protected isFavorite(offer: Offer): boolean {
    return this.favoriteOfferIds().has(offer.id);
  }

  protected loadOffers(): void {
    this.loading.set(true);
    this.apiTestService
      .testAdzuna()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (offers: Offer[]) => {
          this.offers.set(offers);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.loading.set(false);
          this.fail(error);
        },
      });
  }

  protected loadFavorites(): void {
    this.favoriteService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (favorites: Favorite[]) => {
          this.favorites.set(favorites);
          this.succeed(`READ : ${favorites.length} favori(s) chargé(s)`);
        },
        error: (error: HttpErrorResponse) => this.fail(error),
      });
  }

  protected addFavorite(offer: Offer): void {
    this.favoriteService
      .create({ offer })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (favorite: Favorite) => {
          this.favorites.update((favorites: Favorite[]) => [favorite, ...favorites]);
          this.succeed(`CREATE : « ${offer.title} » ajoutée aux favoris`);
        },
        error: (error: HttpErrorResponse) => this.fail(error),
      });
  }

  protected updateNote(favorite: Favorite, note: string): void {
    this.favoriteService
      .update(favorite.id, { note })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated: Favorite) => {
          this.favorites.update((favorites: Favorite[]) =>
            favorites.map((item: Favorite) => (item.id === updated.id ? updated : item)),
          );
          this.succeed(`UPDATE : note de « ${favorite.offer.title} » modifiée`);
        },
        error: (error: HttpErrorResponse) => this.fail(error),
      });
  }

  protected deleteFavorite(favorite: Favorite): void {
    this.favoriteService
      .delete(favorite.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.favorites.update((favorites: Favorite[]) =>
            favorites.filter((item: Favorite) => item.id !== favorite.id),
          );
          this.succeed(`DELETE : « ${favorite.offer.title} » retirée des favoris`);
        },
        error: (error: HttpErrorResponse) => this.fail(error),
      });
  }

  private succeed(message: string): void {
    this.error.set(null);
    this.lastAction.set(message);
  }

  private fail(error: HttpErrorResponse): void {
    this.lastAction.set(null);
    this.error.set(httpErrorMessage(error));
  }
}
