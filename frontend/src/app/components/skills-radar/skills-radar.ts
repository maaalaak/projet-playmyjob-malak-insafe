import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { Gauges, Simulation } from '../../interfaces/simulation';

interface RadarAxis {
  key: keyof Gauges;
  label: string;
  angle: number;
}

interface RadarPoint {
  x: number;
  y: number;
}

const CENTER: number = 120;
const RADIUS: number = 80;
const GRID_LEVELS: readonly number[] = [25, 50, 75, 100];

function pointAt(angle: number, value: number): RadarPoint {
  const distance: number = (RADIUS * value) / 100;
  return { x: CENTER + distance * Math.cos(angle), y: CENTER + distance * Math.sin(angle) };
}

@Component({
  selector: 'app-skills-radar',
  styleUrl: './skills-radar.scss',
  templateUrl: './skills-radar.html',
})
export class SkillsRadar {
  public readonly simulations: InputSignal<Simulation[]> = input.required<Simulation[]>();

  protected readonly center: number = CENTER;
  protected readonly gridLevels: readonly number[] = GRID_LEVELS;
  protected readonly axes: readonly RadarAxis[] = [
    { key: 'team', label: "Travail d'équipe", angle: -Math.PI / 2 },
    { key: 'client', label: 'Relation', angle: 0 },
    { key: 'time', label: 'Gestion du temps', angle: Math.PI / 2 },
    { key: 'quality', label: 'Qualité', angle: Math.PI },
  ];

  protected readonly averages: Signal<Gauges | null> = computed(() => {
    const finished: Simulation[] = this.simulations().filter((simulation: Simulation) => simulation.status === 'finished');
    if (finished.length === 0) {
      return null;
    }

    const average = (key: keyof Gauges): number =>
      Math.round(finished.reduce((sum: number, simulation: Simulation) => sum + simulation.gauges[key], 0) / finished.length);

    return { team: average('team'), client: average('client'), time: average('time'), quality: average('quality') };
  });

  protected readonly shape: Signal<string> = computed(() => {
    const averages: Gauges | null = this.averages();
    return averages ? this.toPoints((axis: RadarAxis) => averages[axis.key]) : '';
  });

  protected gridShape(level: number): string {
    return this.toPoints(() => level);
  }

  protected axisEnd(axis: RadarAxis): RadarPoint {
    return pointAt(axis.angle, 100);
  }

  protected labelPosition(axis: RadarAxis): RadarPoint {
    return pointAt(axis.angle, 128);
  }

  private toPoints(valueOf: (axis: RadarAxis) => number): string {
    return this.axes
      .map((axis: RadarAxis) => {
        const point: RadarPoint = pointAt(axis.angle, valueOf(axis));
        return `${point.x.toFixed(1)},${point.y.toFixed(1)}`;
      })
      .join(' ');
  }
}
