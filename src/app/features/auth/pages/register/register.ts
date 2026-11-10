import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, minLength, required, validate } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../data-access/auth.service';
import { AuthLayout } from '../../components/auth-layout/auth-layout';
import { AuthFeature } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  imports: [FormField, FormRoot, RouterLink, AuthLayout],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  protected readonly features: AuthFeature[] = [
    { icon: 'bi bi-shield-check', title: 'Fast & Secure', text: 'Enterprise-grade security to keep your data safe' },
    { icon: 'bi bi-lightning-charge', title: 'Lightning Speed', text: 'Experience blazing fast performance' },
    { icon: 'bi bi-headset', title: '24/7 Support', text: 'Our team is always here to help you succeed' },
  ];

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly model = signal({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  protected readonly registerForm = form(
    this.model,
    (f) => {
      required(f.firstName, { message: 'First name is required' });
      required(f.lastName, { message: 'Last name is required' });

      required(f.email, { message: 'Email is required' });
      email(f.email, { message: 'Enter a valid email address' });

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
          const data = this.model();
          try {
            await firstValueFrom(
              this.authService.register({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
              }),
            );
            await this.router.navigate(['/verify-email'], { queryParams: { email: data.email } });
          } catch {

          }
        },
      },
    },
  );
}
