import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient)


getMe():Observable<User>{
  return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/api/users/me`).pipe(
    map((response)=>response.data)
  )
}
}
