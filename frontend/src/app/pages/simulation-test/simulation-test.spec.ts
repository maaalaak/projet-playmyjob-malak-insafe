import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DayScript } from '../../interfaces/simulation';
import { SimulationTest } from './simulation-test';

const DAY: DayScript = {
  characters: [{ id: 'lea', name: 'Léa', role: 'Manager', avatar: '👩‍💼' }],
  events: [{ time: '09:00', characterId: 'lea', message: 'Le client veut tout changer !', urgent: false }],
};

describe('SimulationTest', () => {
  let fixture: ComponentFixture<SimulationTest>;
  let httpTesting: HttpTestingController;
  let element: HTMLElement;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [SimulationTest],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SimulationTest);
    httpTesting = TestBed.inject(HttpTestingController);
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
    vi.useRealTimers();
  });

  it('plays a day: message, reply, gauges, then analysis', () => {
    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    httpTesting.expectOne('/api/test/simulation/day').flush({ provider: 'gemini', durationMs: 5, data: DAY });
    vi.advanceTimersByTime(1500);
    fixture.detectChanges();

    expect(element.textContent).toContain('Le client veut tout changer !');

    const textarea: HTMLTextAreaElement = element.querySelector('textarea')!;
    textarea.value = 'On en parle à 14h avec deux options chiffrées.';
    textarea.dispatchEvent(new Event('input'));
    element.querySelector<HTMLFormElement>('app-chat-window form')!.dispatchEvent(new Event('submit'));

    const reply = httpTesting.expectOne('/api/test/simulation/reply');
    expect(reply.request.body.playerReply).toBe('On en parle à 14h avec deux options chiffrées.');
    reply.flush({
      provider: 'gemini',
      durationMs: 5,
      data: { reply: 'Parfait, merci !', effects: { team: 10, client: 5, time: -5, quality: 0 }, skill: 'Négociation' },
    });
    fixture.detectChanges();

    expect(element.textContent).toContain('Parfait, merci !');
    expect(element.textContent).toContain('+10');

    vi.advanceTimersByTime(2500);
    const analysis = httpTesting.expectOne('/api/test/simulation/analysis');
    expect(analysis.request.body.gauges).toEqual({ team: 70, client: 65, time: 55, quality: 60 });
    analysis.flush({
      provider: 'gemini',
      durationMs: 5,
      data: { title: 'Diplomate né', score: 81, strengths: ['Négociation'], advice: 'Continue.' },
    });
    fixture.detectChanges();

    expect(element.textContent).toContain('Diplomate né');
  });
});
