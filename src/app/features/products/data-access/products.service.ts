import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Paginated } from '../../../core/models/paginated.model';
import { ProductQuery } from '../models/product-query.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly http = inject(HttpClient);

  getProducts(take: number, page: number): Observable<Paginated<Product>> {
    const params = new HttpParams().set('Take', take).set('Page', page);

    return this.http
      .get<ApiResponse<Paginated<Product>>>(`${environment.apiUrl}/api/products`, { params })
      .pipe(map((response) => response.data));
  }

  getFiltered(query: ProductQuery): Observable<Paginated<Product>> {
    let params = new HttpParams().set('Take', query.take).set('Page', query.page);

    if (query.sortBy) {
      params = params
        .set('SortBy', query.sortBy)
        .set('SortDescending', query.sortDescending ?? false);
    }

    return this.http
      .get<ApiResponse<Paginated<Product>>>(`${environment.apiUrl}/api/products/filter`, { params })
      .pipe(map((response) => response.data));
  }
}
