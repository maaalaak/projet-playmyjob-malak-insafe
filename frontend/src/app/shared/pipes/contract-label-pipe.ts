import { Pipe, PipeTransform } from '@angular/core';

const CONTRACT_LABELS: Readonly<Record<string, string>> = {
  permanent: 'CDI',
  contract: 'CDD',
};

@Pipe({
  name: 'contractLabel',
})
export class ContractLabelPipe implements PipeTransform {
  public transform(contractType: string | null): string {
    return (contractType && CONTRACT_LABELS[contractType]) || 'Contrat non précisé';
  }
}
