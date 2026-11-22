import { TestBed } from '@angular/core/testing';
import { Simulation } from '../../interfaces/simulation';
import { SkillsRadar } from './skills-radar';

function simulation(status: 'playing' | 'finished', team: number): Simulation {
  return { status, gauges: { team, client: 50, time: 50, quality: 50 } } as Simulation;
}

describe('SkillsRadar', () => {
  it('averages the finished games only', () => {
    const fixture = TestBed.createComponent(SkillsRadar);
    fixture.componentRef.setInput('simulations', [simulation('finished', 80), simulation('finished', 40), simulation('playing', 0)]);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.skills-radar__shape')).not.toBeNull();
    expect(element.querySelector('figcaption')?.textContent).toContain("travail d'équipe 60");
  });

  it('invites to play when no game is finished', () => {
    const fixture = TestBed.createComponent(SkillsRadar);
    fixture.componentRef.setInput('simulations', [simulation('playing', 0)]);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Termine une simulation');
  });
});
