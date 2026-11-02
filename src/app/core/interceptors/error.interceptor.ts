import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { TokenStorageService } from '../services/token-storage.service';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ProblemDetails } from '../models/problem-details.model';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const tokenStorage = inject(TokenStorageService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const problem = error.error as ProblemDetails | null;
      let message = problem?.detail || problem?.title || 'something went wrong';
      if(error.status === 0){
        message = 'Cannot reach the Server'
      }

      const AuthEror = error.status === 401 || !!problem?.detail?.includes('Unauthorized')

      if(AuthEror && tokenStorage.accessToken()){
        tokenStorage.clear()
        router.navigate(['/login'])
      }

      toast.error(message)
      return throwError(()=>error)
    }),
  );
};
