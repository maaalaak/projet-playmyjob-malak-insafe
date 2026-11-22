import { TestBed } from '@angular/core/testing';
import { Loader } from './loader';

describe('Loader', () => {
  it('shows the given label', () => {
    const fixture = TestBed.createComponent(Loader);
    fixture.componentRef.setInput('label', 'Recherche des offres…');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Recherche des offres…');
  });
});
