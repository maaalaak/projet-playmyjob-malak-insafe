import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogData } from '../../interfaces/confirm-dialog-data';

@Component({
  imports: [MatButtonModule, MatDialogModule],
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.html',
})
export class ConfirmDialog {
  protected readonly data: ConfirmDialogData = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
