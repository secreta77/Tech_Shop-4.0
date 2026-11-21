import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, Observable, of, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { AuthService } from '../../auth/data-access/auth.service';
import { Paginated } from '../../../core/models/paginated.model';
import { CartItem } from '../models/cart-item.model';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly url = `${environment.apiUrl}/api/cart`;
  private readonly toastService = inject(ToastService)
  private readonly router = inject(Router)

  private readonly reloadKey = signal(0);

  readonly items = toSignal(
    toObservable(
      computed(() => ({ loggedIn: this.authService.isLoggedIn(), key: this.reloadKey() })),
    ).pipe(
      switchMap(({ loggedIn }) =>
        loggedIn
          ? this.getItems().pipe(
              map((page) => page.items),
              catchError(() => of([])),
            )
          : of([]),
      ),
    ),
    { initialValue: [] },
  );

  readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  readonly total = computed(() => this.items().reduce((sum, item) => sum + item.totalPrice, 0));

  reload(): void {
    this.reloadKey.update((key) => key + 1);
  }

  addToCart(productId: number, quantity = 1): void {
    if (!this.authService.isLoggedIn()) {
      this.toastService.error('Please sign in to add items to your cart');
      this.router.navigate(['/login']);
      return;
    }

    this.add(productId,quantity).subscribe({
      next:()=>{
        this.toastService.success('Item added to cart!')
        this.reload()
      }
    })
  }

  changeQuantity(itemId:number,quantity:number):void{
    this.editQuantity(itemId,quantity).subscribe({
      next:()=>{
        this.reload()
      }
      
    })
  }

  removeItem(itemId:number):void{
    this.remove(itemId).subscribe({
      next:()=>{
        this.toastService.success('Item removed from cart')
        this.reload()
      }
    })
  }

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

  remove(itemId: number): Observable<unknown> {
    return this.http.delete(`${this.url}/remove-from-cart/${itemId}`);
  }
}
