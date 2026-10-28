import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Favorite } from '../../../interfaces/favorite';
import { FavoriteItem } from './favorite-item';

const FAVORITE: Favorite = {
  id: '1',
  offer: {
    id: 'a',
    title: 'Développeur Angular',
    company: 'Acme',
    city: 'Paris',
    contractType: null,
    salaryMin: null,
    salaryMax: null,
    url: 'https://example.com',
    createdAt: '2026-10-01T00:00:00Z',
  },
  note: 'À postuler',
  createdAt: '2026-10-28T09:00:00Z',
  updatedAt: '2026-10-28T09:00:00Z',
};

describe('FavoriteItem', () => {
  let fixture: ComponentFixture<FavoriteItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteItem],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteItem);
    fixture.componentRef.setInput('favorite', FAVORITE);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows the offer title and the current note', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.textContent).toContain('Développeur Angular');
    expect(element.querySelector('input')?.value).toBe('À postuler');
  });
});
