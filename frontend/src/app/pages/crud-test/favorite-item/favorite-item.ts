import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Favorite } from '../../../interfaces/favorite';

@Component({
  imports: [DatePipe, ReactiveFormsModule],
  selector: 'app-favorite-item',
  styleUrl: './favorite-item.scss',
  templateUrl: './favorite-item.html',
})
export class FavoriteItem implements OnChanges {
  @Input({ required: true }) public favorite!: Favorite;
  @Output() public noteSaved: EventEmitter<string> = new EventEmitter<string>();
  @Output() public deleted: EventEmitter<void> = new EventEmitter<void>();

  protected readonly noteMaxLength: number = 200;
  protected readonly noteForm: FormGroup<{ note: FormControl<string> }> = new FormGroup({
    note: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.maxLength(this.noteMaxLength)],
    }),
  });
  protected readonly note: FormControl<string> = this.noteForm.controls.note;

  public ngOnChanges(): void {
    this.note.reset(this.favorite.note);
  }

  protected save(): void {
    if (this.note.valid && this.note.dirty) {
      this.noteSaved.emit(this.note.value.trim());
    }
  }

  protected remove(): void {
    this.deleted.emit();
  }
}
