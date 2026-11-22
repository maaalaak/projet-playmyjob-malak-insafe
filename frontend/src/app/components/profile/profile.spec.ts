import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { Simulation } from '../../interfaces/simulation';
import { Profile } from './profile';

const SIMULATION = {
  id: 'abc',
  offer: { title: 'Infirmier (H/F)', company: 'Clinique de Lyon' },
  gauges: { team: 70, client: 70, time: 60, quality: 80 },
  status: 'finished',
  result: { title: 'Diplomate né', score: 78, strengths: [], advice: '' },
  createdAt: '2026-11-22T10:30:00.000Z',
} as unknown as Simulation;

describe('Profile', () => {
  let fixture: ComponentFixture<Profile>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    localStorage.setItem('playmyjob.session', JSON.stringify({ token: 'jeton', user: { firstName: 'Malak' } }));
    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(true) }) } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    httpTesting.match('/api/favorites');
    httpTesting.expectOne('/api/profile').flush({ firstName: 'Malak', lastName: 'Melhaoui', email: 'malak@example.com' });
    httpTesting.expectOne('/api/simulations').flush([SIMULATION]);
    fixture.detectChanges();
  });

  afterEach(() => localStorage.clear());

  it('greets the user and shows the history with the average score', () => {
    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h1')?.textContent).toContain('Bonjour Malak');
    expect(element.querySelectorAll('.history-list__item').length).toBe(1);
    expect(element.querySelector('.profile__stats')?.textContent).toContain('78');
  });

  it('deletes a game after the confirmation', () => {
    const element: HTMLElement = fixture.nativeElement;
    [...element.querySelectorAll<HTMLButtonElement>('.history-list__item button')].find((button) => button.textContent?.includes('Supprimer'))!.click();

    httpTesting.expectOne({ method: 'DELETE', url: '/api/simulations/abc' }).flush(null);
    fixture.detectChanges();

    expect(element.querySelector('.history-list__item')).toBeNull();
    expect(element.textContent).toContain("Tu n'as encore vécu aucune journée.");
  });
});
