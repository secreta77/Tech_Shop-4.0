import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { User } from '../../models/user.model';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-profile-sidebar',
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './profile-sidebar.html',
  styleUrl: './profile-sidebar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSidebar {
  user = input<User | null>(null)
  loggedOut = output<void>()


  links = [
    { path: '/profile', label: 'My Profile', icon: 'bi-person', exact: true },
    { path: '/profile/cart', label: 'Cart', icon: 'bi-bag', exact: false },
    { path: '/profile/favorites', label: 'Favorites', icon: 'bi-heart', exact: false },
    { path: '/profile/settings', label: 'Settings', icon: 'bi-gear', exact: false },
  ];

  fullName =computed(()=>{
    const user = this.user()
    return user ? `${user.firstName} ${user.lastName}`: ''

  })



  initials = computed(()=>{
      const user = this.user()
      return user ? (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase() : ''
  })

}
