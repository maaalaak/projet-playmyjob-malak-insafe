import { TestBed } from '@angular/core/testing';
import { Conversation } from './conversation';

describe('Conversation', () => {
  it('shows the messages of the characters, the player and the narrator', () => {
    const fixture = TestBed.createComponent(Conversation);
    fixture.componentRef.setInput('characters', [{ id: 'marie', name: 'Marie', role: 'Infirmière', avatar: '👩‍⚕️' }]);
    fixture.componentRef.setInput('messages', [
      { id: '1', author: 'character', characterId: 'marie', text: 'Le patient a de la fièvre.', time: '08:30' },
      { id: '2', author: 'player', characterId: null, text: 'Je prends sa température.', time: '08:30' },
      { id: '3', author: 'narrator', characterId: null, text: 'Temps écoulé.', time: '09:00' },
    ]);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.querySelector('.conversation__row')?.textContent).toContain('Marie');
    expect(element.querySelector('.conversation__bubble--player')?.textContent).toContain('Je prends sa température.');
    expect(element.querySelector('.conversation__narrator')?.textContent).toContain('Temps écoulé.');
  });
});
