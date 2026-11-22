import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ReplyRequest } from '../interfaces/reply-request';
import { Simulation } from '../interfaces/simulation';

@Service()
export class SimulationService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/simulations`;

  public create(offerId: string): Observable<Simulation> {
    return this.http.post<Simulation>(this.apiUrl, { offerId });
  }

  public reply(id: string, request: ReplyRequest): Observable<Simulation> {
    return this.http.post<Simulation>(`${this.apiUrl}/${id}/replies`, request);
  }

  public finish(id: string): Observable<Simulation> {
    return this.http.post<Simulation>(`${this.apiUrl}/${id}/finish`, {});
  }

  public findAll(): Observable<Simulation[]> {
    return this.http.get<Simulation[]>(this.apiUrl);
  }

  public findById(id: string): Observable<Simulation> {
    return this.http.get<Simulation>(`${this.apiUrl}/${id}`);
  }

  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
