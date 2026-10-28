import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DayScript } from '../interfaces/simulation';
import { ApiTestService } from './api-test-service';

describe('ApiTestService', () => {
  let service: ApiTestService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiTestService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('calls the Gemini test route and returns the day script', () => {
    const day: DayScript = {
      characters: [{ id: 'lea', name: 'Léa', role: 'Manager', avatar: '👩‍💼' }],
      events: [{ time: '09:00', characterId: 'lea', message: 'Daily', urgent: false }],
    };
    let received: DayScript | null = null;

    service.testGemini().subscribe((data: DayScript) => (received = data));
    httpTesting.expectOne('/api/test/gemini').flush(day);

    expect(received).toEqual(day);
  });

  it('calls the Adzuna test route', () => {
    service.testAdzuna().subscribe();
    const request = httpTesting.expectOne('/api/test/adzuna');

    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
});
