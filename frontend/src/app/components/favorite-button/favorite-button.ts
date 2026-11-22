import { Component, computed, DestroyRef, inject, input, InputSignal, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { ConfirmDialogData } from '../../interfaces/confirm-dialog-data';
import { Offer } from '../../interfaces/offer';
import { AuthService } from '../../services/auth-service';
import { FavoriteService } from '../../services/favorite-service';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';

const REMOVE_CONFIRMATION: ConfirmDialogData = {
  title: 'Retirer des favoris ?',
  message: 'Cette offre ne sera plus dans tes favoris.',
  confirmLabel: 'Retirer',
};

@Component({
  selector: 'app-favorite-button',
  styleUrl: './favorite-button.scss',
  templateUrl: './favorite-button.html',
})
export class FavoriteButton {
  private readonly favoriteService: FavoriteService = inject(FavoriteService);
  private readonly authService: AuthService = inject(AuthService);
  private readonly router: Router = inject(Router);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  public readonly offer: InputSignal<Offer> = input.required<Offer>();

  protected readonly saving: WritableSignal<boolean> = signal<boolean>(false);
  protected readonly isFavorite: Signal<boolean> = computed(() => this.favoriteService.isFavorite(this.offer().id));

  protected toggle(): void {
    if (!this.authService.isLoggedIn()) {
      void this.router.navigate(['/login']);
      return;
    }

    if (this.isFavorite()) {
      this.confirmRemoval();
    } else {
      this.save();
    }
  }

  private save(): void {
    this.saving.set(true);
    this.favoriteService
      .add(this.offer())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({ next: () => this.saving.set(false), error: () => this.saving.set(false) });
  }

  private confirmRemoval(): void {
    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data: REMOVE_CONFIRMATION })
      .afterClosed()
      .pipe(
        filter((confirmed: boolean | undefined) => confirmed === true),
        switchMap(() => {
          this.saving.set(true);
          return this.favoriteService.remove(this.offer().id);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({ next: () => this.saving.set(false), error: () => this.saving.set(false) });
  }
}
