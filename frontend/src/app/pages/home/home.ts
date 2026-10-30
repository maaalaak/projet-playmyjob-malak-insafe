import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { SimulationPreview } from './simulation-preview/simulation-preview';

@Component({
  imports: [MatButtonModule, RouterLink, SimulationPreview],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home {}
