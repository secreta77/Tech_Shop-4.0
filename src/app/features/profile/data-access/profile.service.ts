import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { ChangePasswordRequest, UpdateProfileRequest, User } from '../models/user.model';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { map } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '../../auth/data-access/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient)
  private readonly authService = inject(AuthService)


readonly currentUser = toSignal(toObservable(this.authService.isLoggedIn).pipe(
  switchMap((loggedIn)=>loggedIn? this.getMe().pipe(catchError(()=>of(null))):of(null)
  
)

)   ,{initialValue:null})

getMe():Observable<User>{
  return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/api/users/me`).pipe(
    map((response)=>response.data)
  )
}

updateProfile(body:UpdateProfileRequest):Observable<unknown>{
return  this.http.put(`${environment.apiUrl}/api/users`,body)
}

changePassword(body:ChangePasswordRequest):Observable<unknown>{
  return this.http.put(`${environment.apiUrl}/api/users/change-password`,body)
}

deleteAccount():Observable<unknown>{
  return this.http.delete(`${environment.apiUrl}/api/users/delete-profile`)
}
}
