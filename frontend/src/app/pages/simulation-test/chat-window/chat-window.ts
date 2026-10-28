import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Character, ChatMessage } from '../../../interfaces/simulation';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-chat-window',
  styleUrl: './chat-window.scss',
  templateUrl: './chat-window.html',
})
export class ChatWindow implements OnChanges {
  @Input({ required: true }) public messages!: ChatMessage[];
  @Input({ required: true }) public characters!: Character[];
  @Input() public typingCharacter: Character | null = null;
  @Input() public canReply: boolean = false;
  @Output() public replySent: EventEmitter<string> = new EventEmitter<string>();

  protected readonly replyMaxLength: number = 500;
  protected readonly replyForm: FormGroup<{ reply: FormControl<string> }> = new FormGroup({
    reply: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/\S/), Validators.maxLength(this.replyMaxLength)],
    }),
  });
  protected readonly reply: FormControl<string> = this.replyForm.controls.reply;

  private charactersById: Map<string, Character> = new Map<string, Character>();

  public ngOnChanges(): void {
    this.charactersById = new Map(this.characters.map((character: Character) => [character.id, character]));

    if (this.canReply) {
      this.reply.enable();
    } else {
      this.reply.disable();
    }
  }

  protected authorOf(message: ChatMessage): Character | null {
    return message.characterId ? (this.charactersById.get(message.characterId) ?? null) : null;
  }

  protected onEnter(event: Event): void {
    if (!(event as KeyboardEvent).shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  protected send(): void {
    if (!this.canReply || this.reply.invalid) {
      return;
    }
    this.replySent.emit(this.reply.value.trim());
    this.reply.reset();
  }
}
