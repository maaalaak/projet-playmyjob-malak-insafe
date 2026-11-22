import { TestBed } from '@angular/core/testing';
import { ScoreRing } from './score-ring';

describe('ScoreRing', () => {
  afterEach(() => vi.useRealTimers());

  it('counts up to the score', () => {
    vi.useFakeTimers();
    const fixture = TestBed.createComponent(ScoreRing);
    fixture.componentRef.setInput('score', 72);
    fixture.detectChanges();

    vi.advanceTimersByTime(2000);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.score-ring__number')?.textContent).toContain('72');
    expect(element.querySelector('.score-ring--high')).not.toBeNull();
    expect(element.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe('Score : 72 sur 100');
  });
});
