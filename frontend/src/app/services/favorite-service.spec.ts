import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Offer } from '../interfaces/offer';
import { FavoriteService } from './favorite-service';

const OFFER = { id: '42', title: 'Infirmier (H/F)' } as Offer;

describe('FavoriteService', () => {
  let service: FavoriteService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(FavoriteService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('knows which offers are favorites after an add and a remove', () => {
    service.add(OFFER).subscribe();
    httpTesting.expectOne({ method: 'POST', url: '/api/favorites' }).flush({ id: 'f1', offer: OFFER, createdAt: '2026-11-22' });
    expect(service.isFavorite('42')).toBe(true);

    service.remove('42').subscribe();
    httpTesting.expectOne({ method: 'DELETE', url: '/api/favorites/f1' }).flush(null);
    expect(service.isFavorite('42')).toBe(false);
  });
});
