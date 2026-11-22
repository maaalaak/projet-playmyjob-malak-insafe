import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { Offer } from '../../interfaces/offer';
import { FavoriteButton } from './favorite-button';

const OFFER = { id: '42', title: 'Infirmier (H/F)' } as Offer;

describe('FavoriteButton', () => {
  async function createButton(): Promise<ComponentFixture<FavoriteButton>> {
    await TestBed.configureTestingModule({
      imports: [FavoriteButton],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture: ComponentFixture<FavoriteButton> = TestBed.createComponent(FavoriteButton);
    fixture.componentRef.setInput('offer', OFFER);
    fixture.detectChanges();
    return fixture;
  }

  afterEach(() => localStorage.clear());

  it('sends a visitor to the login page', async () => {
    localStorage.clear();
    const fixture: ComponentFixture<FavoriteButton> = await createButton();
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);

    fixture.nativeElement.querySelector('button').click();

    expect(navigate).toHaveBeenCalledWith(['/login']);
  });

  it('adds the offer for a logged-in user', async () => {
    localStorage.setItem('playmyjob.session', JSON.stringify({ token: 'jeton', user: {} }));
    const fixture: ComponentFixture<FavoriteButton> = await createButton();
    const httpTesting: HttpTestingController = TestBed.inject(HttpTestingController);
    httpTesting.expectOne({ method: 'GET', url: '/api/favorites' }).flush([]);

    fixture.nativeElement.querySelector('button').click();
    httpTesting.expectOne({ method: 'POST', url: '/api/favorites' }).flush({ id: 'f1', offer: OFFER, createdAt: '2026-11-22' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').getAttribute('aria-pressed')).toBe('true');
  });
});
