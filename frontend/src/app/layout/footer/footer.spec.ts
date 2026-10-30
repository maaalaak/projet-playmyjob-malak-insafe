import { TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  it('shows the authors and the course', () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();

    const text: string = fixture.nativeElement.textContent;
    expect(text).toContain('Malak et Insafe');
    expect(text).toContain('Master MIAGE');
  });
});
