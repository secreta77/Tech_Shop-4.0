import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../features/auth/data-access/auth.service';

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


protected isLoggedIn = this.authService.isLoggedIn


protected logout():void{
  this.authService.logout();
  this.router.navigate(['/'])


}

}
