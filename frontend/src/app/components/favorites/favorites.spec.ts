import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Offer } from '../../interfaces/offer';
import { Favorites } from './favorites';

const OFFER = { id: '42', title: 'Infirmier (H/F)', company: 'Clinique de Lyon', city: 'Lyon', contractType: null, salaryMin: null, salaryMax: null } as Offer;

describe('Favorites', () => {
  let fixture: ComponentFixture<Favorites>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Favorites],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Favorites);
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => httpTesting.verify());

  it('shows the saved offers', () => {
    httpTesting.expectOne('/api/favorites').flush([{ id: 'f1', offer: OFFER, createdAt: '2026-11-22' }]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-offer-card').length).toBe(1);
  });

  it('invites to discover offers when there is no favorite', () => {
    httpTesting.expectOne('/api/favorites').flush([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain("Tu n'as pas encore de favori");
  });
});
