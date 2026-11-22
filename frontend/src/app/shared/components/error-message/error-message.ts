import { Component, input, InputSignal, output, OutputEmitterRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [MatButtonModule],
  selector: 'app-error-message',
  styleUrl: './error-message.scss',
  templateUrl: './error-message.html',
})
export class ErrorMessage {
  public readonly message: InputSignal<string> = input.required<string>();
  public readonly retry: OutputEmitterRef<void> = output<void>();
}
