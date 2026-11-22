import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  styleUrl: './empty-state.scss',
  templateUrl: './empty-state.html',
})
export class EmptyState {
  public readonly message: InputSignal<string> = input.required<string>();
}
