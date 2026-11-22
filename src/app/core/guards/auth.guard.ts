import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
 const tokenStorage = inject(TokenStorageService)
 const router = inject(Router)


 if(tokenStorage.accessToken()){
  return true
 }


 return router.createUrlTree(['/login'])



  return true;
};
