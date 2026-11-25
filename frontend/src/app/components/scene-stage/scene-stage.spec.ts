import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Character } from '../../interfaces/scenario';
import { SceneStage } from './scene-stage';

const TEAM: Character[] = [
  { id: 'marie', name: 'Marie', role: 'Infirmière', avatar: '👩‍⚕️' },
  { id: 'paul', name: 'Paul', role: 'Patient', avatar: '👴' },
];

describe('SceneStage', () => {
  let fixture: ComponentFixture<SceneStage>;
  let element: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    fixture = TestBed.createComponent(SceneStage);
    fixture.componentRef.setInput('setting', 'Service des urgences, Hôpital Saint-Louis');
    fixture.componentRef.setInput('characters', TEAM);
    fixture.componentRef.setInput('speakerId', 'paul');
    fixture.componentRef.setInput('mood', 'inquiet');
    element = fixture.nativeElement;
  });

  afterEach(() => vi.useRealTimers());

  it('picks the decor from the workplace and puts the speaker forward', () => {
    fixture.detectChanges();
    const actors: NodeListOf<HTMLElement> = element.querySelectorAll('.scene-stage__actor');

    expect(element.querySelector('.scene-stage--medical')).not.toBeNull();
    expect(actors.length).toBe(2);
    expect(actors[1].classList).toContain('scene-stage__actor--active');
    expect(actors[0].classList).toContain('scene-stage__actor--waiting');
    expect(actors[1].querySelector('.scene-stage__mood')?.textContent).toBe('😟');
  });

  it('types the line letter by letter, and shows it all on click', () => {
    fixture.componentRef.setInput('line', 'Bonjour, j’ai mal au dos.');
    fixture.detectChanges();
    const bubble: HTMLButtonElement = element.querySelector('.scene-stage__bubble')!;

    vi.advanceTimersByTime(30 * 7);
    fixture.detectChanges();
    expect(bubble.textContent?.trim()).toBe('Bonjour');

    bubble.click();
    fixture.detectChanges();
    expect(bubble.textContent?.trim()).toBe('Bonjour, j’ai mal au dos.');
    expect(element.querySelector('.scene-stage__caret')).toBeNull();
  });

  it('shows thinking dots while the character prepares an answer', () => {
    fixture.componentRef.setInput('thinking', true);
    fixture.detectChanges();

    expect(element.querySelector('.scene-stage__dots')).not.toBeNull();
  });
});
