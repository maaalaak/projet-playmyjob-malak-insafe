import { Component, input, InputSignal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  imports: [MatProgressSpinnerModule],
  selector: 'app-loader',
  styleUrl: './loader.scss',
  templateUrl: './loader.html',
})
export class Loader {
  public readonly label: InputSignal<string> = input<string>('Chargement…');
}
