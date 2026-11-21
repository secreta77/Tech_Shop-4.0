import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../features/auth/data-access/auth.service';
import { ProfileService } from '../../features/profile/data-access/profile.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Header {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly profileService = inject(ProfileService)



protected isLoggedIn = this.authService.isLoggedIn


protected logout():void{
  this.authService.logout();
  this.router.navigate(['/'])


}


protected readonly initials = computed(()=>{
  const user = this.profileService.currentUser()
  return user ? (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase() : ''
}) 

}
