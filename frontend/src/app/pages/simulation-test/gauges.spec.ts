import { applyEffects, emptyGauge, gaugeLevel } from './gauges';

describe('gauges', () => {
  it('applies the effects and keeps every gauge between 0 and 100', () => {
    const gauges = applyEffects({ team: 95, client: 10, time: 50, quality: 50 }, { team: 20, client: -20, time: 5, quality: 0 });

    expect(gauges).toEqual({ team: 100, client: 0, time: 55, quality: 50 });
  });

  it('finds the gauge that reached 0', () => {
    expect(emptyGauge({ team: 40, client: 0, time: 50, quality: 50 })?.key).toBe('client');
    expect(emptyGauge({ team: 40, client: 1, time: 50, quality: 50 })).toBeNull();
  });

  it('gives a level for the colour of the gauge', () => {
    expect(gaugeLevel(80)).toBe('high');
    expect(gaugeLevel(45)).toBe('medium');
    expect(gaugeLevel(10)).toBe('low');
  });
});
