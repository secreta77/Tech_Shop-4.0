import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Category } from '../models/category.model';
import { environment } from '../../../../environments/environment';
import { map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly http = inject(HttpClient)

  readonly categories = this.http.get<ApiResponse <Category[]>>(`${environment.apiUrl}/api/categories`)
  .pipe
  (map((response)=> response.data),
  shareReplay(1),)

}
