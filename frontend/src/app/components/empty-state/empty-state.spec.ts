import { TestBed } from '@angular/core/testing';
import { EmptyState } from './empty-state';

describe('EmptyState', () => {
  it('shows the given message', () => {
    const fixture = TestBed.createComponent(EmptyState);
    fixture.componentRef.setInput('message', 'Aucune offre trouvée.');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Aucune offre trouvée.');
  });
});
