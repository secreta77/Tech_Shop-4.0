import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required, validate } from '@angular/forms/signals';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthLayout } from '../../components/auth-layout/auth-layout';
import { AuthService } from '../../data-access/auth.service';
import { AuthFeature } from '../../models/auth.model';

@Component({
  selector: 'app-reset-password',
  imports: [FormField, FormRoot, RouterLink, AuthLayout],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword {
  protected readonly tips: AuthFeature[] = [
    { icon: 'bi bi-check-circle-fill', title: 'Use at least 8 characters', text: '' },
    { icon: 'bi bi-check-circle-fill', title: 'Include uppercase & lowercase', text: '' },
    { icon: 'bi bi-check-circle-fill', title: 'Add numbers & special characters', text: '' },
  ];

  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly token = inject(ActivatedRoute).snapshot.queryParamMap.get('token') ?? '';

  protected readonly visible = signal({ password: false, confirm: false });

  private readonly model = signal({
    password: '',
    confirmPassword: '',
  });

  protected readonly strength = computed(() => {
    const password = this.model().password;
    if (!password) {
      return { label: '', level: 0 };
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

    const labels = ['Weak', 'Weak', 'Medium', 'Strong'];
    return { label: labels[score], level: score };
  });

  protected readonly resetForm = form(
    this.model,
    (f) => {
      required(f.password, { message: 'Password is required' });
      minLength(f.password, 8, { message: 'Password must be at least 8 characters' });

      required(f.confirmPassword, { message: 'Please confirm your password' });
      validate(f.confirmPassword, ({ value, valueOf }) =>
        value() !== valueOf(f.password)
          ? { kind: 'mismatch', message: 'Passwords do not match' }
          : undefined,
      );
    },
    {
      submission: {
        action: async () => {
          try {
            await firstValueFrom(
              this.authService.resetPassword({ token: this.token, password: this.model().password }),
            );
            this.toastService.success('Password reset successfully!');
            await this.router.navigate(['/login']);
          } catch {
            return;
          }
        },
      },
    },
  );

  protected toggle(field: 'password' | 'confirm'): void {
    this.visible.update((state) => ({ ...state, [field]: !state[field] }));
  }
}
