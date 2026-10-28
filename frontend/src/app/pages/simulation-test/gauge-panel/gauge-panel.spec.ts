import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GaugePanel } from './gauge-panel';

describe('GaugePanel', () => {
  let fixture: ComponentFixture<GaugePanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaugePanel],
    }).compileComponents();

    fixture = TestBed.createComponent(GaugePanel);
    fixture.componentRef.setInput('gauges', { team: 70, client: 20, time: 50, quality: 50 });
    fixture.componentRef.setInput('lastEffects', { team: 8, client: -12, time: 0, quality: 0 });
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows the last effects next to the gauges', () => {
    const text: string = fixture.nativeElement.textContent;

    expect(text).toContain('+8');
    expect(text).toContain('-12');
  });

  it('colours a low gauge in red', () => {
    const fills: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('.gauge-panel__fill');

    expect(fills[1].classList).toContain('gauge-panel__fill--low');
  });
});
