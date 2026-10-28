import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CreateFavoriteRequest, Favorite, UpdateFavoriteRequest } from '../interfaces/favorite';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = `${environment.apiUrl}/test/favorites`;

  public getAll(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(this.baseUrl);
  }

  public getById(id: string): Observable<Favorite> {
    return this.http.get<Favorite>(`${this.baseUrl}/${id}`);
  }

  public create(request: CreateFavoriteRequest): Observable<Favorite> {
    return this.http.post<Favorite>(this.baseUrl, request);
  }

  public update(id: string, request: UpdateFavoriteRequest): Observable<Favorite> {
    return this.http.put<Favorite>(`${this.baseUrl}/${id}`, request);
  }

  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
