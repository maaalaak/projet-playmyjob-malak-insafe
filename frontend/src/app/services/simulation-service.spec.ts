import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SimulationService } from './simulation-service';

describe('SimulationService', () => {
  let service: SimulationService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    service = TestBed.inject(SimulationService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('starts a game from an offer', () => {
    service.create('42').subscribe();

    const request = httpTesting.expectOne({ method: 'POST', url: '/api/simulations' });
    expect(request.request.body).toEqual({ offerId: '42' });
    request.flush({});
  });

  it('sends a reply to the right game', () => {
    service.reply('abc', { reply: 'Je vérifie le dossier.', timedOut: false }).subscribe();

    httpTesting.expectOne({ method: 'POST', url: '/api/simulations/abc/replies' }).flush({});
  });
});
