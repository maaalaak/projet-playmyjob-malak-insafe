import { FormControl } from '@angular/forms';
import { ContractType } from './offer-search';

export interface OfferSearchForm {
  job: FormControl<string>;
  city: FormControl<string>;
  contract: FormControl<ContractType | null>;
}
