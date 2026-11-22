import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Offer } from '../../../interfaces/offer';
import { OfferCard } from './offer-card';

const OFFER: Offer = {
  id: '42',
  title: 'Infirmier (H/F)',
  company: 'Hôpital de Lyon',
  city: 'Lyon',
  description: '',
  contractType: 'permanent',
  salaryMin: 2000,
  salaryMax: 2400,
  url: 'https://example.com/offre',
  createdAt: '2026-11-20',
};

describe('OfferCard', () => {
  it('shows the offer with a link to its page', async () => {
    await TestBed.configureTestingModule({
      imports: [OfferCard],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(OfferCard);
    fixture.componentRef.setInput('offer', OFFER);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/offers/42');
    expect(element.textContent).toContain('Hôpital de Lyon');
    expect(element.textContent).toContain('CDI');
  });
});
