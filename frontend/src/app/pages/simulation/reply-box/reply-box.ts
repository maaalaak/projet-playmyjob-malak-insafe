import { Component, effect, input, InputSignal, output, OutputEmitterRef, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { interval, Subscription, take } from 'rxjs';
import { ReplyForm } from '../../../interfaces/reply-form';

const URGENT_SECONDS: number = 45;
const CRITICAL_SECONDS: number = 10;
const REPLY_MAX_LENGTH: number = 500;

@Component({
  imports: [ReactiveFormsModule, MatButtonModule],
  selector: 'app-reply-box',
  styleUrl: './reply-box.scss',
  templateUrl: './reply-box.html',
})
export class ReplyBox {
  public readonly disabled: InputSignal<boolean> = input<boolean>(false);
  public readonly urgent: InputSignal<boolean> = input<boolean>(false);
  /** Change à chaque nouvelle situation : le champ est vidé et le compte à rebours repart. */
  public readonly eventKey: InputSignal<number> = input.required<number>();
  public readonly replySent: OutputEmitterRef<string> = output<string>();
  public readonly timedOut: OutputEmitterRef<void> = output<void>();

  protected readonly totalSeconds: number = URGENT_SECONDS;
  protected readonly criticalSeconds: number = CRITICAL_SECONDS;
  protected readonly maxLength: number = REPLY_MAX_LENGTH;
  protected readonly secondsLeft: WritableSignal<number | null> = signal<number | null>(null);
  protected readonly form: FormGroup<ReplyForm> = new FormGroup<ReplyForm>({
    reply: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(REPLY_MAX_LENGTH)],
    }),
  });
  protected readonly reply: FormControl<string> = this.form.controls.reply;

  constructor() {
    effect(() => {
      this.eventKey();
      this.reply.reset();
    });

    effect((onCleanup: (cleanup: () => void) => void) => {
      this.eventKey();

      if (!this.urgent() || this.disabled()) {
        this.secondsLeft.set(null);
        return;
      }

      const countdown: Subscription = this.startCountdown();
      onCleanup(() => countdown.unsubscribe());
    });
  }

  protected send(): void {
    const text: string = this.reply.value.trim();

    if (this.disabled() || !text || this.reply.invalid) {
      return;
    }

    this.replySent.emit(text);
  }

  protected onEnter(event: Event): void {
    if (!(event as KeyboardEvent).shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  private startCountdown(): Subscription {
    this.secondsLeft.set(URGENT_SECONDS);

    return interval(1000)
      .pipe(take(URGENT_SECONDS))
      .subscribe(() => {
        const left: number = (this.secondsLeft() ?? 1) - 1;
        this.secondsLeft.set(left);

        if (left === 0) {
          this.timedOut.emit();
        }
      });
  }
}
