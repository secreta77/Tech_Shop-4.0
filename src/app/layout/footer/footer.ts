import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { InstallButton } from '../../features/pwa/components/install-button/install-button';
import { InstallService } from '../../features/pwa/data-access/install.service';

@Component({
  selector: 'app-footer',
  imports: [InstallButton],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Footer {
  protected readonly installService = inject(InstallService);

  protected install(): void {
    this.installService.install();
  }
}
