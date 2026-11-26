import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-offline-banner',
  imports: [],
  templateUrl: './offline-banner.html',
  styleUrl: './offline-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfflineBanner {
  visible = input(false);
}
