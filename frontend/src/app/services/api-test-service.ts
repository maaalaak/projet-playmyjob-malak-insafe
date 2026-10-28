import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Offer } from '../interfaces/offer';
import { DayScript } from '../interfaces/simulation';

@Injectable({
  providedIn: 'root',
})
export class ApiTestService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly baseUrl: string = `${environment.apiUrl}/test`;

  public testGemini(): Observable<DayScript> {
    return this.http.get<DayScript>(`${this.baseUrl}/gemini`);
  }

  public testGroq(): Observable<DayScript> {
    return this.http.get<DayScript>(`${this.baseUrl}/groq`);
  }

  public testAdzuna(): Observable<Offer[]> {
    return this.http.get<Offer[]>(`${this.baseUrl}/adzuna`);
  }
}
