import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactList } from './contact-list';

describe('ContactList', () => {
  let fixture: ComponentFixture<ContactList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactList],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactList);
    fixture.componentRef.setInput('characters', [
      { id: 'lea', name: 'Léa', role: 'Manager', avatar: '👩‍💼' },
      { id: 'tom', name: 'Tom', role: 'Développeur', avatar: '👨‍💻' },
    ]);
    fixture.componentRef.setInput('typingCharacterId', 'tom');
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows who is typing', () => {
    const items: NodeListOf<HTMLElement> = fixture.nativeElement.querySelectorAll('li');

    expect(items[0].textContent).toContain('Manager');
    expect(items[1].textContent).toContain('écrit…');
  });
});
