import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, minLength, required, validate } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../auth/data-access/auth.service';
import { ProfileService } from '../../data-access/profile.service';

@Component({
  selector: 'app-settings',
  imports: [FormField, FormRoot],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  private readonly profileService = inject(ProfileService);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);

  protected readonly visible = signal({ current: false, next: false, confirm: false });
  protected readonly deleting = signal(false);

  private readonly model = signal({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  protected readonly passwordForm = form(
    this.model,
    (f) => {
      required(f.currentPassword, { message: 'Current password is required' });

      required(f.newPassword, { message: 'New password is required' });
      minLength(f.newPassword, 8, { message: 'Password must be at least 8 characters' });

      required(f.confirmPassword, { message: 'Please confirm your new password' });
      validate(f.confirmPassword, ({ value, valueOf }) =>
        value() !== valueOf(f.newPassword)
          ? { kind: 'mismatch', message: 'Passwords do not match' }
          : undefined,
      );
    },
    {
      submission: {
        action: async () => {
          const data = this.model();
          try {
            await firstValueFrom(
              this.profileService.changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
              }),
            );
            this.toastService.success('Password updated successfully');
            this.passwordForm().reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
          } catch {
            // errorInterceptor already showed the error toast
          }
        },
      },
    },
  );

  protected toggle(field: 'current' | 'next' | 'confirm'): void {
    this.visible.update((state) => ({ ...state, [field]: !state[field] }));
  }

  protected async deleteAccount(): Promise<void> {
    const confirmed = await this.toastService.confirm(
      'Delete your account permanently? This cannot be undone.',
      'Delete',
    );
    if (!confirmed) {
      return;
    }

    this.deleting.set(true);
    try {
      await firstValueFrom(this.profileService.deleteAccount());
      this.authService.logout();
      this.toastService.success('Your account has been deleted');
      await this.router.navigate(['/']);
    } catch {
      this.deleting.set(false);
    }
  }
}
