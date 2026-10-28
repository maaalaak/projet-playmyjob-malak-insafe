import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatWindow } from './chat-window';

describe('ChatWindow', () => {
  let fixture: ComponentFixture<ChatWindow>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWindow],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatWindow);
    fixture.componentRef.setInput('characters', [{ id: 'lea', name: 'Léa', role: 'Manager', avatar: '👩‍💼' }]);
    fixture.componentRef.setInput('messages', [
      { id: 1, kind: 'character', characterId: 'lea', text: 'On a un souci !', time: '09:00', skill: null },
    ]);
    fixture.componentRef.setInput('canReply', true);
    fixture.detectChanges();
    await fixture.whenStable();
    element = fixture.nativeElement;
  });

  it("shows the character's message with their name", () => {
    expect(element.textContent).toContain('Léa');
    expect(element.textContent).toContain('On a un souci !');
  });

  it('sends the trimmed reply', () => {
    let sent: string | null = null;
    fixture.componentInstance.replySent.subscribe((reply: string) => (sent = reply));

    const textarea: HTMLTextAreaElement = element.querySelector('textarea')!;
    textarea.value = '  Je m’en occupe  ';
    textarea.dispatchEvent(new Event('input'));
    element.querySelector('form')!.dispatchEvent(new Event('submit'));

    expect(sent).toBe('Je m’en occupe');
  });

  it('refuses an empty reply', () => {
    let sent: boolean = false;
    fixture.componentInstance.replySent.subscribe(() => (sent = true));

    element.querySelector('form')!.dispatchEvent(new Event('submit'));

    expect(sent).toBe(false);
  });
});
