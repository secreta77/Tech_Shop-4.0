import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'app-install-button',
  imports: [],
  templateUrl: './install-button.html',
  styleUrl: './install-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstallButton {
  label = input('Install app');

  installClicked = output<void>();
}
