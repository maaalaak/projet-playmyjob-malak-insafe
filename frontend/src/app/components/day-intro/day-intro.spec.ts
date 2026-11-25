import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Simulation } from '../../interfaces/simulation';
import { DayIntro } from './day-intro';

const SIMULATION: Simulation = {
  id: 'abc123xyz',
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
    characters: [
      { id: 'marie', name: 'Marie', role: 'Infirmière senior', avatar: '👩‍⚕️' },
      { id: 'paul', name: 'Paul', role: 'Patient', avatar: '👴' },
    ],
    events: [],
  },
  source: 'ia',
  gauges: { team: 60, client: 60, time: 60, quality: 60 },
  exchanges: [],
  status: 'playing',
  result: null,
  createdAt: '2026-11-22',
  finishedAt: null,
};

describe('DayIntro', () => {
  let fixture: ComponentFixture<DayIntro>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(DayIntro);
    fixture.componentRef.setInput('simulation', SIMULATION);
    fixture.componentRef.setInput('playerName', 'Malak Melhaoui');
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  afterEach(() => vi.useRealTimers());

  it('shows the employee badge and the team of the day', () => {
    expect(element.querySelector('.day-intro__identity strong')?.textContent).toBe('Malak Melhaoui');
    expect(element.querySelector('.day-intro__photo')?.textContent).toBe('M');
    expect(element.querySelector('.day-intro__badge-footer small')?.textContent).toBe('PMJ-ABC123');
    expect(element.querySelectorAll('.day-intro__team li').length).toBe(2);
  });

  it('validates the badge, then starts the day once', () => {
    vi.useFakeTimers();
    const started = vi.fn();
    fixture.componentInstance.started.subscribe(started);
    const button: HTMLButtonElement = element.querySelector('.day-intro__start')!;

    button.click();
    button.click();
    fixture.detectChanges();
    expect(element.querySelector('.day-intro__scan')?.textContent).toContain('Badge validé');
    expect(started).not.toHaveBeenCalled();

    vi.advanceTimersByTime(900);
    expect(started).toHaveBeenCalledTimes(1);
  });
});
