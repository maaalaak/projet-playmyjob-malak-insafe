import { Component, computed, input, InputSignal, Signal } from '@angular/core';
import { ChatMessage } from '../../../interfaces/chat-message';
import { Character } from '../../../interfaces/scenario';

@Component({
  selector: 'app-conversation',
  styleUrl: './conversation.scss',
  templateUrl: './conversation.html',
})
export class Conversation {
  public readonly messages: InputSignal<ChatMessage[]> = input.required<ChatMessage[]>();
  public readonly characters: InputSignal<Character[]> = input.required<Character[]>();

  private readonly charactersById: Signal<Map<string, Character>> = computed(
    () => new Map(this.characters().map((character: Character) => [character.id, character])),
  );

  protected characterOf(message: ChatMessage): Character | undefined {
    return message.characterId ? this.charactersById().get(message.characterId) : undefined;
  }
}
