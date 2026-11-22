import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { Simulation } from '../../interfaces/simulation';
import { Result } from './result';

const SIMULATION = {
  id: 'abc',
  offer: { id: '42', title: 'Infirmier (H/F)', company: 'Clinique de Lyon' },
  scenario: { setting: '', intro: '', characters: [], events: [] },
  gauges: { team: 70, client: 75, time: 60, quality: 80 },
  exchanges: [],
  status: 'finished',
  result: {
    title: 'Diplomate né',
    score: 78,
    strengths: ['Écoute', 'Sang-froid'],
    advice: 'Continue à expliquer tes décisions.',
  },
} as unknown as Simulation;

describe('Result', () => {
  it('shows the score, the profile, the strengths and the advice', async () => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'result/:id', component: Result }]), provideHttpClient(), provideHttpClientTesting()],
    });
    const harness: RouterTestingHarness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/result/abc', Result);

    TestBed.inject(HttpTestingController).expectOne('/api/simulations/abc').flush(SIMULATION);
    harness.detectChanges();

    const element: HTMLElement = harness.routeNativeElement!;
    expect(element.querySelector('h1')?.textContent).toContain('Diplomate né');
    expect(element.querySelector('app-score-ring [role="img"]')?.getAttribute('aria-label')).toBe('Score : 78 sur 100');
    expect(element.querySelectorAll('.result__strengths li').length).toBe(2);
    expect(element.textContent).toContain('Continue à expliquer tes décisions.');
  });
});
