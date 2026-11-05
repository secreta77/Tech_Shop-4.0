import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { email, form, FormField, FormRoot, required } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../data-access/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormField, FormRoot, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  private readonly model = signal({
    email: '',
    password: '',
    remember: false,
  });

  protected readonly loginForm = form(
    this.model,
    (f) => {
      required(f.email, { message: 'Email is required' });
      email(f.email, { message: 'Enter a valid email address' });
      required(f.password, { message: 'Password is required' });
    },
    {
      submission: {
        action: async () => {
          const data = this.model();
          try {
            await firstValueFrom(
              this.authService.login({ email: data.email, password: data.password }, data.remember),
            );
            await this.router.navigate(['/']);
          } catch {
            // errorInterceptor already showed the error toast
          }
        },
      },
    },
  );
}
