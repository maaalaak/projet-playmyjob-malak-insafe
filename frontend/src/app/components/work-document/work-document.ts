import { Component, input, InputSignal } from '@angular/core';
import { ScenarioDocument } from '../../interfaces/scenario';

@Component({
  selector: 'app-work-document',
  styleUrl: './work-document.scss',
  templateUrl: './work-document.html',
})
export class WorkDocument {
  public readonly document: InputSignal<ScenarioDocument> = input.required<ScenarioDocument>();
}
