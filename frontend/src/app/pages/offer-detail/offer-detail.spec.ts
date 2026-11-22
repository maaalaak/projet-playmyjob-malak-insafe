import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Offer } from '../../interfaces/offer';
import { OfferDetail } from './offer-detail';

const OFFER: Offer = {
  id: '42',
  title: 'Infirmier (H/F)',
  company: 'Hôpital de Lyon',
  city: 'Lyon',
  description: 'Prise en charge des patients en service de médecine.',
  contractType: 'permanent',
  salaryMin: null,
  salaryMax: null,
  url: 'https://example.com/offre',
  createdAt: '2026-11-20',
};

describe('OfferDetail', () => {
  it('shows the offer with its simulation and real offer links', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'offers/:id', component: OfferDetail }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/offers/42', OfferDetail);

    TestBed.inject(HttpTestingController).expectOne('/api/offers/42').flush(OFFER);
    harness.detectChanges();

    const element: HTMLElement = harness.routeNativeElement!;
    expect(element.querySelector('h1')?.textContent).toContain('Infirmier (H/F)');
    expect(element.querySelector('a[href="/simulation/42"]')).not.toBeNull();
    expect(element.querySelector('a[href="https://example.com/offre"]')).not.toBeNull();
  });
});
