import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HiringVerdict } from './hiring-verdict';

describe('HiringVerdict', () => {
  let fixture: ComponentFixture<HiringVerdict>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(HiringVerdict);
    element = fixture.nativeElement;
  });

  it('hires a good player and throws confetti', () => {
    fixture.componentRef.setInput('score', 82);
    fixture.detectChanges();

    expect(element.querySelector('.hiring-verdict--hired')?.textContent).toContain('Embauché·e !');
    expect(element.querySelectorAll('.hiring-verdict__confetti span').length).toBe(40);
  });

  it('extends the trial for a middle score, without confetti', () => {
    fixture.componentRef.setInput('score', 50);
    fixture.detectChanges();

    expect(element.querySelector('.hiring-verdict--trial')?.textContent).toContain("Période d'essai prolongée");
    expect(element.querySelector('.hiring-verdict__confetti')).toBeNull();
  });
});
