import { Component, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-auth-layout',
  styleUrl: './auth-layout.scss',
  templateUrl: './auth-layout.html',
})
export class AuthLayout {
  public readonly heading: InputSignal<string> = input.required<string>();
}
