import { TestBed } from '@angular/core/testing';
import { Simulation } from '../../interfaces/simulation';
import { DayRecap } from './day-recap';

const SIMULATION = {
  scenario: {
    setting: 'Service de gériatrie',
    intro: '',
    characters: [{ id: 'marie', name: 'Marie', role: 'Infirmière', avatar: '👩‍⚕️' }],
    events: [
      { time: '08:30', characterId: 'marie', message: 'Le patient a de la fièvre.', urgent: false, document: null },
      { time: '10:00', characterId: 'marie', message: 'Une patiente est tombée.', urgent: true, document: null },
    ],
  },
  exchanges: [
    {
      reply: 'Je prends sa température.',
      timedOut: false,
      reaction: 'Bien.',
      mood: 'content',
      skill: 'Rigueur',
      effects: { team: 5, client: 5, time: 0, quality: 5 },
    },
    { reply: '', timedOut: true, reaction: 'Trop tard.', mood: 'agace', skill: 'Réactivité', effects: { team: -5, client: -5, time: -5, quality: -5 } },
  ],
} as unknown as Simulation;

describe('DayRecap', () => {
  it('shows one line per situation played, with the reply and the skill', () => {
    const fixture = TestBed.createComponent(DayRecap);
    fixture.componentRef.setInput('simulation', SIMULATION);
    fixture.detectChanges();

    const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.day-recap__item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Je prends sa température.');
    expect(items[1].textContent).toContain('pas de réaction à temps');
    expect(items[1].querySelector('.day-recap__urgent')).not.toBeNull();
  });
});
