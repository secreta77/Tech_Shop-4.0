import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Paginated } from '../../../core/models/paginated.model';
import { Review } from '../models/review.model';

@Injectable({
  providedIn: 'root',
})
export class ReviewsService {
  private readonly http = inject(HttpClient);

  getByProduct(productId: number, take = 100, page = 1): Observable<Paginated<Review>> {
    const params = new HttpParams().set('Take', take).set('Page', page);

    return this.http
      .get<ApiResponse<Paginated<Review>>>(`${environment.apiUrl}/api/reviews/${productId}`, { params })
      .pipe(map((response) => response.data));
  }


  create(productId: number, rate: number): Observable<unknown> {
    return this.http.post(`${environment.apiUrl}/api/reviews`, { productId, rate });
  }

  update(reviewId: number, rate: number): Observable<unknown> {
    return this.http.put(`${environment.apiUrl}/api/reviews`, { reviewId, rate });
  }
}
