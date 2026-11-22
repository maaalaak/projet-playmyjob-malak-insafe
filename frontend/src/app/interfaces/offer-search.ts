export type ContractType = 'permanent' | 'contract';

export interface OfferSearch {
  job: string;
  city: string;
  contract: ContractType | null;
  page: number;
}
