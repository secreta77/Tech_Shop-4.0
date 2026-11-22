import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const PROFILE_ROUTES: Routes = [
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/profile-shell/profile-shell').then((m) => m.ProfileShell),
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/my-profile/my-profile').then((m) => m.MyProfile),
      },
      {
        path: 'cart',
        loadComponent: () => import('../cart/pages/cart/cart').then((m) => m.Cart),
      },
      {
        path: 'favorites',
        loadComponent: () =>
          import('../favorites/pages/favorites/favorites').then((m) => m.Favorites),
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
      },
    ],
  },
];