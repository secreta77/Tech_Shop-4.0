import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AuthFeature, AuthStat } from '../../models/auth.model';

@Component({
  selector: 'app-auth-layout',
  imports: [],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayout {
  readonly icon = input.required<string>();
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly description = input.required<string>();
  readonly stats = input<AuthStat[]>([]);
  readonly features = input<AuthFeature[]>([]);
}
