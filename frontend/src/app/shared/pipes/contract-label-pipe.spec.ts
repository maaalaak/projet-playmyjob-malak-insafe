import { ContractLabelPipe } from './contract-label-pipe';

describe('ContractLabelPipe', () => {
  const pipe: ContractLabelPipe = new ContractLabelPipe();

  it('translates the contract types', () => {
    expect(pipe.transform('permanent')).toBe('CDI');
    expect(pipe.transform('contract')).toBe('CDD');
    expect(pipe.transform(null)).toBe('Contrat non précisé');
  });
});
