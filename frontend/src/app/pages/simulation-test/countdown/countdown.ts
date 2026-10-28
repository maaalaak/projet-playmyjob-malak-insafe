import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval, take } from 'rxjs';

@Component({
  imports: [],
  selector: 'app-countdown',
  styleUrl: './countdown.scss',
  templateUrl: './countdown.html',
})
export class Countdown implements OnInit {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  @Input({ required: true }) public seconds!: number;
  @Output() public expired: EventEmitter<void> = new EventEmitter<void>();

  protected readonly remaining: WritableSignal<number> = signal<number>(0);

  public ngOnInit(): void {
    this.remaining.set(this.seconds);

    interval(1000)
      .pipe(take(this.seconds), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.remaining.update((remaining: number) => remaining - 1);
        if (this.remaining() === 0) {
          this.expired.emit();
        }
      });
  }
}
