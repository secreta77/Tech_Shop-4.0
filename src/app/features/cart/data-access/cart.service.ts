import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Paginated } from '../../../core/models/paginated.model';
import { CartItem } from '../models/cart-item.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/api/cart`;

  getItems(take = 100, page = 1): Observable<Paginated<CartItem>> {
    const params = new HttpParams().set('Take', take).set('Page', page);

    return this.http
      .get<ApiResponse<Paginated<CartItem>>>(this.url, { params })
      .pipe(map((response) => response.data));
  }

  add(productId: number, quantity = 1): Observable<unknown> {
    return this.http.post(`${this.url}/add-to-cart`, { productId, quantity });
  }

  editQuantity(itemId: number, quantity: number): Observable<unknown> {
    return this.http.put(`${this.url}/edit-quantity`, { itemId, quantity });
  }

  remove(productId: number): Observable<unknown> {
    return this.http.delete(`${this.url}/remove-from-cart/${productId}`);
  }
}
