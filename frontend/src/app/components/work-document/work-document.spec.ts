import { TestBed } from '@angular/core/testing';
import { WorkDocument } from './work-document';

describe('WorkDocument', () => {
  it('shows the title and the content of the document', () => {
    const fixture = TestBed.createComponent(WorkDocument);
    fixture.componentRef.setInput('document', { title: 'Dossier patient', content: 'Allergie à la pénicilline.' });
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('h3')?.textContent).toContain('Dossier patient');
    expect(element.textContent).toContain('Allergie à la pénicilline.');
  });
});
