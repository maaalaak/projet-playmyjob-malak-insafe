import { Gauges } from './simulation';

export interface GaugeDefinition {
  key: keyof Gauges;
  label: string;
  icon: string;
}
