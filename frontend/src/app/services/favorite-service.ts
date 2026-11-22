import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Service, Signal, signal, WritableSignal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Favorite } from '../interfaces/favorite';
import { Offer } from '../interfaces/offer';
import { AuthService } from './auth-service';

@Service()
export class FavoriteService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly authService: AuthService = inject(AuthService);
  private readonly apiUrl: string = `${environment.apiUrl}/favorites`;
  private readonly items: WritableSignal<Favorite[]> = signal<Favorite[]>([]);
  private readonly offerIds: Signal<Set<string>> = computed(
    () => new Set(this.items().map((favorite: Favorite) => favorite.offer.id)),
  );

  public readonly favorites: Signal<Favorite[]> = this.items.asReadonly();

  constructor() {
    // Les favoris suivent la session : chargés à la connexion, vidés à la déconnexion.
    effect(() => {
      if (this.authService.isLoggedIn()) {
        this.load().subscribe({ error: () => this.items.set([]) });
      } else {
        this.items.set([]);
      }
    });
  }

  public load(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(this.apiUrl).pipe(tap((favorites: Favorite[]) => this.items.set(favorites)));
  }

  public isFavorite(offerId: string): boolean {
    return this.offerIds().has(offerId);
  }

  public add(offer: Offer): Observable<Favorite> {
    return this.http
      .post<Favorite>(this.apiUrl, { offer })
      .pipe(tap((favorite: Favorite) => this.items.update((items: Favorite[]) => [favorite, ...items])));
  }

  public remove(offerId: string): Observable<void> {
    const favorite: Favorite | undefined = this.items().find((item: Favorite) => item.offer.id === offerId);

    return this.http
      .delete<void>(`${this.apiUrl}/${favorite?.id}`)
      .pipe(tap(() => this.items.update((items: Favorite[]) => items.filter((item: Favorite) => item.offer.id !== offerId))));
  }
}
