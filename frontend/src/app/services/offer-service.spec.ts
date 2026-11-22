import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { OfferService } from './offer-service';

describe('OfferService', () => {
  let service: OfferService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(OfferService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('sends the search without the empty fields', () => {
    service.search({ job: 'infirmier', city: '', contract: null, page: 2 }).subscribe();

    const request = httpTesting.expectOne((req) => req.url === '/api/offers');
    expect(request.request.params.toString()).toBe('job=infirmier&page=2');
    request.flush({ offers: [], page: 2, totalPages: 0, totalCount: 0 });
  });
});
