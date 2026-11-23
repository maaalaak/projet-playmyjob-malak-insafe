import { TestBed } from '@angular/core/testing';
import { SpeechRecognitionErrorEvent, SpeechRecognitionResultEvent } from '../interfaces/speech-recognition';
import { VoiceInputService } from './voice-input-service';

/** Faux micro : le test décide de ce qu'il « entend ». */
class FakeRecognition {
  public static last: FakeRecognition | null = null;
  public lang: string = '';
  public continuous: boolean = false;
  public interimResults: boolean = false;
  public onresult: ((event: SpeechRecognitionResultEvent) => void) | null = null;
  public onerror: ((event: SpeechRecognitionErrorEvent) => void) | null = null;
  public onend: (() => void) | null = null;
  public start = vi.fn();
  public stop = vi.fn();

  constructor() {
    FakeRecognition.last = this;
  }

  public hear(...phrases: string[]): void {
    this.onresult?.({ results: phrases.map((transcript: string) => [{ transcript }]) });
  }
}

describe('VoiceInputService', () => {
  let service: VoiceInputService;

  beforeEach(() => {
    vi.stubGlobal('webkitSpeechRecognition', FakeRecognition);
    TestBed.configureTestingModule({});
    service = TestBed.inject(VoiceInputService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    FakeRecognition.last = null;
  });

  it('listens in French and sends the whole text heard so far', () => {
    const onText = vi.fn();
    service.start(onText);
    FakeRecognition.last!.hear('Je vais voir', ' le patient');

    expect(FakeRecognition.last!.lang).toBe('fr-FR');
    expect(service.listening()).toBe(true);
    expect(onText).toHaveBeenCalledWith('Je vais voir le patient');
  });

  it('explains the error and stops listening when the browser ends', () => {
    service.start(vi.fn());
    FakeRecognition.last!.onerror?.({ error: 'not-allowed' });
    FakeRecognition.last!.onend?.();

    expect(service.error()).toContain('Autorise');
    expect(service.listening()).toBe(false);
  });

  it('is not supported when the browser cannot listen', () => {
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();

    expect(TestBed.inject(VoiceInputService).isSupported).toBe(false);
  });
});
