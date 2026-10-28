import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SimulationTestService } from './simulation-test-service';

describe('SimulationTestService', () => {
  let service: SimulationTestService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SimulationTestService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('starts a day with POST', () => {
    service.startDay({ jobTitle: 'Data Analyst', provider: 'auto' }).subscribe();
    const request = httpTesting.expectOne('/api/test/simulation/day');

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ jobTitle: 'Data Analyst', provider: 'auto' });
    request.flush({ provider: 'gemini', durationMs: 10, data: { characters: [], events: [] } });
  });

  it('sends the day for analysis with POST', () => {
    service
      .analyzeDay({
        jobTitle: 'UX Designer',
        provider: 'groq',
        exchanges: [],
        gauges: { team: 50, client: 50, time: 50, quality: 50 },
        gameOver: false,
      })
      .subscribe();
    const request = httpTesting.expectOne('/api/test/simulation/analysis');

    expect(request.request.method).toBe('POST');
    request.flush({ provider: 'groq', durationMs: 10, data: { title: 'Ok', score: 80, strengths: [], advice: '' } });
  });
});
