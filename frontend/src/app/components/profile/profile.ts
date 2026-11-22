import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, DestroyRef, inject, Signal, signal, WritableSignal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { ConfirmDialogData } from '../../interfaces/confirm-dialog-data';
import { Simulation } from '../../interfaces/simulation';
import { User } from '../../interfaces/user';
import { AuthService } from '../../services/auth-service';
import { SimulationService } from '../../services/simulation-service';
import { httpErrorMessage } from '../../utils/http-error-message';
import { ConfirmDialog } from '../confirm-dialog/confirm-dialog';
import { EmptyState } from '../empty-state/empty-state';
import { ErrorMessage } from '../error-message/error-message';
import { HistoryList } from '../history-list/history-list';
import { Loader } from '../loader/loader';
import { ProfileEditor } from '../profile-editor/profile-editor';
import { SkillsRadar } from '../skills-radar/skills-radar';

const DELETE_CONFIRMATION: ConfirmDialogData = {
  title: 'Supprimer cette partie ?',
  message: 'Elle disparaîtra de ton historique et de ton radar.',
  confirmLabel: 'Supprimer',
};

@Component({
  imports: [MatButtonModule, RouterLink, EmptyState, ErrorMessage, HistoryList, Loader, ProfileEditor, SkillsRadar],
  selector: 'app-profile',
  styleUrl: './profile.scss',
  templateUrl: './profile.html',
})
export class Profile {
  private readonly simulationService: SimulationService = inject(SimulationService);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  protected readonly user: Signal<User | null> = inject(AuthService).user;
  protected readonly simulations: WritableSignal<Simulation[]> = signal<Simulation[]>([]);
  protected readonly loading: WritableSignal<boolean> = signal<boolean>(true);
  protected readonly error: WritableSignal<string | null> = signal<string | null>(null);

  protected readonly finishedCount: Signal<number> = computed(
    () => this.simulations().filter((simulation: Simulation) => simulation.result !== null).length,
  );
  protected readonly averageScore: Signal<number | null> = computed(() => {
    const scores: number[] = this.simulations().flatMap((simulation: Simulation) => (simulation.result ? [simulation.result.score] : []));
    return scores.length > 0 ? Math.round(scores.reduce((sum: number, score: number) => sum + score, 0) / scores.length) : null;
  });

  constructor() {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.error.set(null);

    this.simulationService
      .findAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (simulations: Simulation[]) => {
          this.simulations.set(simulations);
          this.loading.set(false);
        },
        error: (error: HttpErrorResponse) => {
          this.error.set(httpErrorMessage(error));
          this.loading.set(false);
        },
      });
  }

  protected confirmDelete(simulation: Simulation): void {
    this.dialog
      .open<ConfirmDialog, ConfirmDialogData, boolean>(ConfirmDialog, { data: DELETE_CONFIRMATION })
      .afterClosed()
      .pipe(
        filter((confirmed: boolean | undefined) => confirmed === true),
        switchMap(() => this.simulationService.remove(simulation.id)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => this.simulations.update((items: Simulation[]) => items.filter((item: Simulation) => item.id !== simulation.id)),
        error: (error: HttpErrorResponse) => this.error.set(httpErrorMessage(error)),
      });
  }
}
