import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EffectBurst } from './effect-burst';

describe('EffectBurst', () => {
  let fixture: ComponentFixture<EffectBurst>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(EffectBurst);
    fixture.componentRef.setInput('key', 1);
    element = fixture.nativeElement;
  });

  it('shows nothing before the first answer', () => {
    fixture.detectChanges();

    expect(element.querySelector('.effect-burst')).toBeNull();
  });

  it('celebrates a good answer with sparkles and a chip per changed gauge', () => {
    fixture.componentRef.setInput('effects', { team: 10, client: 5, time: 0, quality: 5 });
    fixture.detectChanges();
    const chips: string[] = Array.from(element.querySelectorAll('.effect-burst__chip'), (chip: Element) => chip.textContent!.trim());

    expect(element.querySelector('.effect-burst--good')).not.toBeNull();
    expect(element.querySelectorAll('.effect-burst__sparkle').length).toBe(10);
    expect(chips).toEqual(['+10 🤝', '+5 🙂', '+5 ⭐']);
  });

  it('warns after a bad answer, with negative chips', () => {
    fixture.componentRef.setInput('effects', { team: -10, client: -5, time: 5, quality: 0 });
    fixture.detectChanges();

    expect(element.querySelector('.effect-burst--bad')).not.toBeNull();
    expect(element.querySelectorAll('.effect-burst__chip--negative').length).toBe(2);
    expect(element.querySelector('.effect-burst__sparkle')).toBeNull();
  });
});
