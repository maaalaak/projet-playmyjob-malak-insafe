import { minutesOfDay } from './minutes-of-day';

describe('minutesOfDay', () => {
  it('reads the usual ways of writing a time', () => {
    expect(minutesOfDay('09:30')).toBe(570);
    expect(minutesOfDay('14h')).toBe(840);
    expect(minutesOfDay('8h15')).toBe(495);
  });

  it('falls back to 9 a.m. when the time cannot be read', () => {
    expect(minutesOfDay('en fin de matinée')).toBe(540);
  });
});
