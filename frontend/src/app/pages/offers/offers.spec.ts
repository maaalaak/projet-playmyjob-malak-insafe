import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { OfferPage } from '../../interfaces/offer-page';
import { Offers } from './offers';

const PAGE: OfferPage = {
  offers: [
    {
      id: '42',
      title: 'Infirmier (H/F)',
      company: 'Hôpital de Lyon',
      city: 'Lyon',
      description: '',
      contractType: 'permanent',
      salaryMin: null,
      salaryMax: null,
      url: 'https://example.com/offre',
      createdAt: '2026-11-20',
    },
  ],
  page: 1,
  totalPages: 1,
  totalCount: 1,
};

describe('Offers', () => {
  let harness: RouterTestingHarness;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'offers', component: Offers }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    harness = await RouterTestingHarness.create();
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('asks for a job before calling the backend', async () => {
    await harness.navigateByUrl('/offers', Offers);

    expect(harness.routeNativeElement?.textContent).toContain('Cherche un poste');
  });

  it('shows the offers of the search written in the address', async () => {
    await harness.navigateByUrl('/offers?job=infirmier&city=Lyon', Offers);

    httpTesting.expectOne((req) => req.url === '/api/offers' && req.params.get('job') === 'infirmier').flush(PAGE);
    harness.detectChanges();

    expect(harness.routeNativeElement?.querySelectorAll('app-offer-card').length).toBe(1);
    expect(harness.routeNativeElement?.textContent).toContain('1 offres trouvées');
  });
});
