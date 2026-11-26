import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { filter, interval } from 'rxjs';
import { ToastService } from './toast.service';

const CHECK_EVERY_MS = 30 * 60 * 1000;

@Injectable({
  providedIn: 'root',
})
export class UpdateService {
  private readonly swUpdate = inject(SwUpdate);
  private readonly toastService = inject(ToastService);

  constructor() {
    if (!this.swUpdate.isEnabled) {
      return;
    }

    this.swUpdate.versionUpdates
      .pipe(
        filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.askToReload());

    interval(CHECK_EVERY_MS)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.swUpdate.checkForUpdate());
  }

  private async askToReload(): Promise<void> {
    const reload = await this.toastService.confirm('A new version is available', 'Reload');

    if (reload) {
      await this.swUpdate.activateUpdate();
      document.location.reload();
    }
  }
}
