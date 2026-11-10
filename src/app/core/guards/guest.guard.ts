import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

export const guestGuard: CanActivateFn = (route, state) => {
  const tokenStorage = inject(TokenStorageService)
  const router = inject(Router)



  if(tokenStorage.accessToken()){
    return router.createUrlTree(['/'])
  }





  return true;
};
