import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthLayout } from '../../components/auth-layout/auth-layout';
import { AuthService } from '../../data-access/auth.service';
import { AuthFeature } from '../../models/auth.model';

@Component({
  selector: 'app-forgot-password',
  imports: [FormField, FormRoot, RouterLink, AuthLayout],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPassword {
  protected readonly features: AuthFeature[] = [
    { icon: 'bi bi-envelope', title: 'Email Confirmation', text: "We'll send a reset link to your email" },
    { icon: 'bi bi-shield-check', title: 'Secure Process', text: 'Your account security is our priority' },
    { icon: 'bi bi-clock', title: 'Quick Recovery', text: 'Reset your password in just a few minutes' },
  ];

  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  private readonly model = signal({ email: '' });

  protected readonly forgotForm = form(
    this.model,
    (f) => {
      required(f.email, { message: 'Email is required' });
      email(f.email, { message: 'Enter a valid email address' });
    },
    {
      submission: {
        action: async () => {
          try {
            await firstValueFrom(this.authService.forgotPassword(this.model().email.trim()));
            this.toastService.success('If the email exists, a reset link has been sent.');
          } catch {
            return;
          }
        },
      },
    },
  );
}
