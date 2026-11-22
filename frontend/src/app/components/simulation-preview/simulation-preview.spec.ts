import { TestBed } from '@angular/core/testing';
import { SimulationPreview } from './simulation-preview';

describe('SimulationPreview', () => {
  it('shows the patient and three possible choices', () => {
    const fixture = TestBed.createComponent(SimulationPreview);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Docteur');
    expect(element.querySelectorAll('li').length).toBe(3);
  });
});
