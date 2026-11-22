import { SalaryRangePipe } from './salary-range-pipe';

describe('SalaryRangePipe', () => {
  const pipe: SalaryRangePipe = new SalaryRangePipe();

  // Le format français utilise des espaces insécables : on les remplace pour comparer.
  function format(min: number | null, max: number | null): string {
    return pipe.transform(min, max).replace(/\s/g, ' ');
  }

  it('formats the salary range in euros', () => {
    expect(format(1570, 2230)).toBe('1 570 € – 2 230 €');
    expect(format(1800, null)).toBe('À partir de 1 800 €');
    expect(format(null, null)).toBe('Salaire non précisé');
  });
});
