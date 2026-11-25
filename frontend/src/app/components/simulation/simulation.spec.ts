import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Simulation } from '../../interfaces/simulation';
import { SimulationPage } from './simulation';

const SIMULATION: Simulation = {
  id: 'abc',
  offer: {
    id: '42',
    title: 'Infirmier (H/F)',
    company: 'Clinique de Lyon',
    city: 'Lyon',
    description: '',
    contractType: null,
    salaryMin: null,
    salaryMax: null,
    url: 'https://example.com/offre',
    createdAt: '2026-11-20',
  },
  scenario: {
    setting: 'Service de gériatrie',
    intro: 'Premier jour dans le service.',
    characters: [{ id: 'marie', name: 'Marie', role: 'Infirmière senior', avatar: '👩‍⚕️' }],
    events: [{ time: '08:30', characterId: 'marie', message: 'Le patient de la 304 a de la fièvre.', urgent: false, document: null }],
  },
  source: 'ia',
  gauges: { team: 60, client: 60, time: 60, quality: 60 },
  exchanges: [],
  status: 'playing',
  result: null,
  createdAt: '2026-11-22',
  finishedAt: null,
};

describe('SimulationPage', () => {
  it('starts the game, shows the introduction, then the first situation', async () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'simulation/:offerId', component: SimulationPage }]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/simulation/42', SimulationPage);

    const request = TestBed.inject(HttpTestingController).expectOne({ method: 'POST', url: '/api/simulations' });
    expect(request.request.body).toEqual({ offerId: '42' });
    request.flush(SIMULATION);
    harness.detectChanges();

    const element: HTMLElement = harness.routeNativeElement!;
    expect(element.querySelector('h1')?.textContent).toContain('Service de gériatrie');

    vi.useFakeTimers();
    element.querySelector<HTMLButtonElement>('.day-intro__start')!.click();
    vi.advanceTimersByTime(1000);
    vi.useRealTimers();
    harness.detectChanges();

    expect(element.textContent).toContain('Le patient de la 304 a de la fièvre.');
    expect(element.querySelector('app-reply-box')).not.toBeNull();
  });
});
