import { hiringDecision } from './hiring-decision';

describe('hiringDecision', () => {
  it('hires from 70, extends the trial from 45, and declines below', () => {
    expect(hiringDecision(70).level).toBe('hired');
    expect(hiringDecision(69).level).toBe('trial');
    expect(hiringDecision(45).level).toBe('trial');
    expect(hiringDecision(44).level).toBe('declined');
  });
});
