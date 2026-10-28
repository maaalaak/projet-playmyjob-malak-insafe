import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultCard } from './result-card';

describe('ResultCard', () => {
  let fixture: ComponentFixture<ResultCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResultCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ResultCard);
    fixture.componentRef.setInput('analysis', {
      provider: 'gemini',
      durationMs: 900,
      data: { title: 'Diplomate né', score: 78, strengths: ['Écoute'], advice: 'Ose trancher.' },
    });
    fixture.componentRef.setInput('gauges', { team: 70, client: 60, time: 40, quality: 55 });
    fixture.componentRef.setInput('exchanges', []);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows the score and the profile title', () => {
    const text: string = fixture.nativeElement.textContent;

    expect(text).toContain('78');
    expect(text).toContain('Diplomate né');
  });
});
