import { Pipe, PipeTransform } from '@angular/core';

const EURO_FORMAT: Intl.NumberFormat = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

@Pipe({
  name: 'salaryRange',
})
export class SalaryRangePipe implements PipeTransform {
  public transform(min: number | null, max: number | null): string {
    if (min !== null && max !== null) {
      return min === max ? EURO_FORMAT.format(min) : `${EURO_FORMAT.format(min)} – ${EURO_FORMAT.format(max)}`;
    }
    if (min !== null) {
      return `À partir de ${EURO_FORMAT.format(min)}`;
    }
    if (max !== null) {
      return `Jusqu'à ${EURO_FORMAT.format(max)}`;
    }
    return 'Salaire non précisé';
  }
}
