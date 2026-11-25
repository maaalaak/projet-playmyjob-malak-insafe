import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DayClock } from './day-clock';

describe('DayClock', () => {
  it('shows the time and turns the hands to it', () => {
    const fixture: ComponentFixture<DayClock> = TestBed.createComponent(DayClock);
    fixture.componentRef.setInput('time', '15:30');
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('time')?.textContent).toBe('15:30');
    expect(element.querySelector<HTMLElement>('.day-clock__hand--hour')?.style.transform).toBe('rotate(465deg)');
    expect(element.querySelector<HTMLElement>('.day-clock__hand--minute')?.style.transform).toBe('rotate(5580deg)');
  });
});
