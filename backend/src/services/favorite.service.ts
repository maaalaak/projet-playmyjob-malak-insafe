import { randomUUID } from 'node:crypto';
import { db } from '../data/db.ts';
import { HttpError } from '../errors/http-error.ts';
import type { CreateFavoriteRequest, Favorite, UpdateFavoriteRequest } from '../models/favorite.ts';

class FavoriteService {
  public findAll(): Favorite[] {
    return [...db.data.favorites].sort((a: Favorite, b: Favorite) => b.createdAt.localeCompare(a.createdAt));
  }

  public findById(id: string): Favorite {
    const favorite: Favorite | undefined = db.data.favorites.find((item: Favorite) => item.id === id);

    if (!favorite) {
      throw new HttpError(404, 'Favori introuvable');
    }

    return favorite;
  }

  public async create(request: CreateFavoriteRequest): Promise<Favorite> {
    const alreadySaved: boolean = db.data.favorites.some((item: Favorite) => item.offer.id === request.offer.id);

    if (alreadySaved) {
      throw new HttpError(409, 'Cette offre est déjà dans les favoris');
    }

    const now: string = new Date().toISOString();
    const favorite: Favorite = { id: randomUUID(), offer: request.offer, note: request.note, createdAt: now, updatedAt: now };

    db.data.favorites.push(favorite);
    await db.write();

    return favorite;
  }

  public async update(id: string, request: UpdateFavoriteRequest): Promise<Favorite> {
    const favorite: Favorite = this.findById(id);

    favorite.note = request.note;
    favorite.updatedAt = new Date().toISOString();
    await db.write();

    return favorite;
  }

  public async remove(id: string): Promise<void> {
    this.findById(id);

    db.data.favorites = db.data.favorites.filter((item: Favorite) => item.id !== id);
    await db.write();
  }
}

export const favoriteService: FavoriteService = new FavoriteService();
