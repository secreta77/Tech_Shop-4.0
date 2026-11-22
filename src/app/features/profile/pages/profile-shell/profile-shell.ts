import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/data-access/auth.service';
import { ProfileSidebar } from '../../components/profile-sidebar/profile-sidebar';
import { ProfileService } from '../../data-access/profile.service';

@Component({
  selector: 'app-profile-shell',
  imports: [RouterOutlet, ProfileSidebar],
  templateUrl: './profile-shell.html',
  styleUrl: './profile-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileShell {
  private readonly authService = inject(AuthService);
  private readonly profileService = inject(ProfileService);
  private readonly router = inject(Router);

  protected readonly user = this.profileService.currentUser;

  protected logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
