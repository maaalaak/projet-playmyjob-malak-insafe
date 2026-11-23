import { TestBed } from '@angular/core/testing';
import { SpeechService } from './speech-service';

/** Fausse phrase à lire : elle garde seulement les réglages, sans produire de son. */
class FakeUtterance {
  public lang: string = '';
  public rate: number = 1;
  public pitch: number = 1;
  public voice: SpeechSynthesisVoice | null = null;

  constructor(public readonly text: string) {}
}

describe('SpeechService', () => {
  let service: SpeechService;
  const fakeSynthesis = { speak: vi.fn(), cancel: vi.fn(), getVoices: vi.fn(() => []) };

  beforeEach(() => {
    vi.stubGlobal('speechSynthesis', fakeSynthesis);
    vi.stubGlobal('SpeechSynthesisUtterance', FakeUtterance);
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechService);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('reads the text in French without the emojis', () => {
    service.speak('Bonjour 👋 tu es prête ?', 0);

    const utterance: FakeUtterance = fakeSynthesis.speak.mock.calls[0][0];
    expect(utterance.text).toBe('Bonjour tu es prête ?');
    expect(utterance.lang).toBe('fr-FR');
  });

  it('gives each character a different pitch', () => {
    service.speak('Première voix', 0);
    service.speak('Deuxième voix', 1);

    const [first, second]: FakeUtterance[] = fakeSynthesis.speak.mock.calls.map((call: unknown[]) => call[0] as FakeUtterance);
    expect(first.pitch).not.toBe(second.pitch);
  });

  it('stays silent and remembers the choice when the sound is muted', () => {
    service.toggleMuted();
    service.speak('Personne ne doit entendre ça', 0);

    expect(fakeSynthesis.speak).not.toHaveBeenCalled();
    expect(fakeSynthesis.cancel).toHaveBeenCalled();
    expect(localStorage.getItem('playmyjob.voice-muted')).toBe('true');
  });
});
