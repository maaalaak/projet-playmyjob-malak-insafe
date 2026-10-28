import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Countdown } from './countdown';

describe('Countdown', () => {
  let fixture: ComponentFixture<Countdown>;

  beforeEach(async () => {
    vi.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [Countdown],
    }).compileComponents();

    fixture = TestBed.createComponent(Countdown);
    fixture.componentRef.setInput('seconds', 3);
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('emits "expired" once the time is over', () => {
    let expired: number = 0;
    fixture.componentInstance.expired.subscribe(() => expired++);

    vi.advanceTimersByTime(2000);
    expect(expired).toBe(0);

    vi.advanceTimersByTime(1000);
    expect(expired).toBe(1);
  });
});
