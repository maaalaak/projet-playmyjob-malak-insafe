import { Component, input, InputSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Offer } from '../../interfaces/offer';
import { ContractLabelPipe } from '../../pipes/contract-label-pipe';
import { SalaryRangePipe } from '../../pipes/salary-range-pipe';
import { FavoriteButton } from '../favorite-button/favorite-button';

@Component({
  imports: [RouterLink, ContractLabelPipe, SalaryRangePipe, FavoriteButton],
  selector: 'app-offer-card',
  styleUrl: './offer-card.scss',
  templateUrl: './offer-card.html',
})
export class OfferCard {
  public readonly offer: InputSignal<Offer> = input.required<Offer>();
}
