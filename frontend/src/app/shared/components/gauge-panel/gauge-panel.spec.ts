import { TestBed } from '@angular/core/testing';
import { GaugePanel } from './gauge-panel';

describe('GaugePanel', () => {
  it('shows each gauge with its level and its last effect', () => {
    const fixture = TestBed.createComponent(GaugePanel);
    fixture.componentRef.setInput('gauges', { team: 80, client: 45, time: 10, quality: 60 });
    fixture.componentRef.setInput('lastEffects', { team: 10, client: -5, time: 0, quality: 0 });
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelectorAll('.gauge-panel__fill--high').length).toBe(2);
    expect(element.querySelector('.gauge-panel__fill--low')).not.toBeNull();
    expect(element.querySelector('.gauge-panel__effect--negative')?.textContent).toContain('-5');
  });
});
