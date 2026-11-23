import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpeechService } from '../../services/speech-service';
import { VoiceInputService } from '../../services/voice-input-service';
import { ReplyBox } from './reply-box';

describe('ReplyBox', () => {
  let fixture: ComponentFixture<ReplyBox>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplyBox);
    fixture.componentRef.setInput('eventKey', 0);
    element = fixture.nativeElement;
  });

  afterEach(() => vi.useRealTimers());

  it('sends the written reply', () => {
    fixture.detectChanges();
    const sent = vi.fn();
    fixture.componentInstance.replySent.subscribe(sent);

    const textarea: HTMLTextAreaElement = element.querySelector('textarea')!;
    textarea.value = '  Je vérifie le dossier.  ';
    textarea.dispatchEvent(new Event('input'));
    element.querySelector('form')?.dispatchEvent(new Event('submit'));

    expect(sent).toHaveBeenCalledWith('Je vérifie le dossier.');
  });

  it('warns the page when the urgent countdown reaches zero', () => {
    vi.useFakeTimers();
    fixture.componentRef.setInput('urgent', true);
    fixture.detectChanges();
    const timedOut = vi.fn();
    fixture.componentInstance.timedOut.subscribe(timedOut);

    vi.advanceTimersByTime(45_000);

    expect(timedOut).toHaveBeenCalledTimes(1);
  });
});

describe('ReplyBox microphone', () => {
  it('silences the character and adds the spoken text after the typed text', () => {
    const stopSpeaking = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        { provide: SpeechService, useValue: { stop: stopSpeaking } },
        {
          provide: VoiceInputService,
          useValue: {
            isSupported: true,
            listening: signal(false),
            error: signal(null),
            start: (onText: (text: string) => void) => onText('et je préviens le médecin.'),
            stop: vi.fn(),
          },
        },
      ],
    });
    const fixture: ComponentFixture<ReplyBox> = TestBed.createComponent(ReplyBox);
    fixture.componentRef.setInput('eventKey', 0);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    const textarea: HTMLTextAreaElement = element.querySelector('textarea')!;
    textarea.value = 'Je vérifie le dossier';
    textarea.dispatchEvent(new Event('input'));
    element.querySelector<HTMLButtonElement>('.reply-box__mic')!.click();

    expect(stopSpeaking).toHaveBeenCalled();
    expect(textarea.value).toBe('Je vérifie le dossier et je préviens le médecin.');
  });
});
