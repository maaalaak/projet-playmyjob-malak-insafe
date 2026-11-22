import { TestBed } from '@angular/core/testing';
import { CharacterAvatar } from './character-avatar';

describe('CharacterAvatar', () => {
  it('shows the character with the expression of its mood', () => {
    const fixture = TestBed.createComponent(CharacterAvatar);
    fixture.componentRef.setInput('character', { id: 'marie', name: 'Marie', role: 'Infirmière', avatar: '👩‍⚕️' });
    fixture.componentRef.setInput('mood', 'agace');
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(element.textContent).toContain('Marie');
    expect(element.querySelector('.character-avatar__face--agace')).not.toBeNull();
    expect(element.textContent).toContain('agacé');
  });
});
