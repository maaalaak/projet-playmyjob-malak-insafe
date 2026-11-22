import { randomUUID } from 'node:crypto';
import { db } from '../data/db.ts';
import { HttpError } from '../errors/http-error.ts';
import type { Favorite, PublicFavorite } from '../models/favorite.ts';
import type { Offer } from '../models/offer.ts';

class FavoriteService {
  public findAll(userId: string): PublicFavorite[] {
    return db.data.favorites
      .filter((favorite: Favorite) => favorite.userId === userId)
      .sort((a: Favorite, b: Favorite) => b.createdAt.localeCompare(a.createdAt))
      .map((favorite: Favorite) => this.toPublic(favorite));
  }

  public async create(userId: string, offer: Offer): Promise<PublicFavorite> {
    const alreadySaved: boolean = db.data.favorites.some(
      (favorite: Favorite) => favorite.userId === userId && favorite.offer.id === offer.id,
    );

    if (alreadySaved) {
      throw new HttpError(409, 'Cette offre est déjà dans tes favoris');
    }

    const favorite: Favorite = { id: randomUUID(), userId, offer, createdAt: new Date().toISOString() };
    db.data.favorites.push(favorite);
    await db.write();

    return this.toPublic(favorite);
  }

  public async remove(userId: string, id: string): Promise<void> {
    const owned: boolean = db.data.favorites.some((favorite: Favorite) => favorite.id === id && favorite.userId === userId);

    if (!owned) {
      throw new HttpError(404, 'Favori introuvable');
    }

    db.data.favorites = db.data.favorites.filter((favorite: Favorite) => favorite.id !== id);
    await db.write();
  }

  private toPublic(favorite: Favorite): PublicFavorite {
    const { userId: _userId, ...publicFavorite }: Favorite = favorite;
    return publicFavorite;
  }
}

export const favoriteService: FavoriteService = new FavoriteService();
