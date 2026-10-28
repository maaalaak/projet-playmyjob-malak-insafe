import { Component, Input } from '@angular/core';
import { Character } from '../../../interfaces/simulation';

@Component({
  imports: [],
  selector: 'app-contact-list',
  styleUrl: './contact-list.scss',
  templateUrl: './contact-list.html',
})
export class ContactList {
  @Input({ required: true }) public characters!: Character[];
  @Input() public activeCharacterId: string | null = null;
  @Input() public typingCharacterId: string | null = null;
}
