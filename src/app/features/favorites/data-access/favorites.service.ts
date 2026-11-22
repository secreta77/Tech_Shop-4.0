import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, inject, Injectable, linkedSignal, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { catchError, EMPTY, forkJoin, map, mergeMap, Observable, of, Subject, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ApiResponse } from '../../../core/models/api-response.model';
import { Paginated } from '../../../core/models/paginated.model';
import { ToastService } from '../../../core/services/toast.service';
import { AuthService } from '../../auth/data-access/auth.service';
import { Product } from '../../products/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);
  private readonly router = inject(Router);
  private readonly url = `${environment.apiUrl}/api/favorites`;

  private readonly reloadKey = signal(0);
  private readonly toggleClicked = new Subject<number>();

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

  readonly ids = linkedSignal(() => new Set(this.items().map((product) => product.id)));

  readonly count = computed(() => this.ids().size);

  constructor() {
    this.toggleClicked
      .pipe(
        mergeMap((productId) => {
          const wasFavorite = this.ids().has(productId);
          this.setLocal(productId, !wasFavorite);

          const request = wasFavorite ? this.remove(productId) : this.add(productId);

          return request.pipe(
            catchError(() => {
              this.setLocal(productId, wasFavorite);
              return EMPTY;
            }),
          );
        }),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.reload());
  }

  reload(): void {
    this.reloadKey.update((key) => key + 1);
  }

  toggle(productId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.toastService.error('Please sign in to save favorites');
      this.router.navigate(['/login']);
      return;
    }

    this.toggleClicked.next(productId);
  }

  clear(): void {
    const items = this.items();
    if (items.length === 0) {
      return;
    }

    forkJoin(items.map((product) => this.remove(product.id))).subscribe({
      next: () => {
        this.toastService.success('Favorites cleared');
        this.reload();
      },
      error: () => this.reload(),
    });
  }

  getItems(take = 100, page = 1): Observable<Paginated<Product>> {
    const params = new HttpParams().set('Take', take).set('Page', page);

    return this.http
      .get<ApiResponse<Paginated<Product>>>(this.url, { params })
      .pipe(map((response) => response.data));
  }

  add(productId: number): Observable<unknown> {
    return this.http.post(`${this.url}/${productId}`, null);
  }

  remove(productId: number): Observable<unknown> {
    return this.http.delete(`${this.url}/${productId}`);
  }

  private setLocal(productId: number, favorite: boolean): void {
    this.ids.update((ids) => {
      const next = new Set(ids);
      if (favorite) {
        next.add(productId);
      } else {
        next.delete(productId);
      }
      return next;
    });
  }
}
