import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Offer } from '../interfaces/offer';
import { OfferPage } from '../interfaces/offer-page';
import { OfferSearch } from '../interfaces/offer-search';

@Service()
export class OfferService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly apiUrl: string = `${environment.apiUrl}/offers`;

  public search(search: OfferSearch): Observable<OfferPage> {
    let params: HttpParams = new HttpParams().set('job', search.job).set('page', search.page);

    if (search.city) {
      params = params.set('city', search.city);
    }
    if (search.contract) {
      params = params.set('contract', search.contract);
    }

    return this.http.get<OfferPage>(this.apiUrl, { params });
  }

  public findById(id: string): Observable<Offer> {
    return this.http.get<Offer>(`${this.apiUrl}/${id}`);
  }
}
