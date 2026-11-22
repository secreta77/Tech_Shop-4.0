import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, combineLatest, filter, map, of, switchMap, tap } from 'rxjs';
import { ReviewsSection } from '../../../reviews/pages/reviews-section/reviews-section';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductsService } from '../../data-access/products.service';
import { ReviewsService } from '../../../reviews/data-access/reviews.service';
import { CartService } from '../../../cart/data-access/cart.service';
import { FavoritesService } from '../../../favorites/data-access/favorites.service';

@Component({
  selector: 'app-product-page',
  imports: [DecimalPipe, NgOptimizedImage, RouterLink, ReviewsSection, ProductCard],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPage {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cartService = inject(CartService);
  private readonly favoritesService = inject(FavoritesService);
  protected readonly favoriteIds = this.favoritesService.ids;
  private readonly reviewService = inject(ReviewsService)



  protected readonly loading = signal(true);
  protected readonly selectedImage = signal(0);
  protected readonly stars = [1, 2, 3, 4, 5];
  protected readonly quantity = signal(1);
  protected readonly activetab = signal<'description' | 'specifications' | 'reviews'>('description')

  protected readonly countKey = signal(0);

  protected readonly reviewsCount = toSignal(
    combineLatest([
      this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
      toObservable(this.countKey),
    ]).pipe(
      switchMap(([id]) =>
        this.reviewService.getByProduct(id, 1, 1).pipe(
          map((page) => page.totalCount),
          catchError(() => of(0)),
        ),
      ),
    ),
    { initialValue: 0 },
  );



  protected readonly product = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      tap(() => {
        this.loading.set(true);
        this.selectedImage.set(0);
        this.quantity.set(1);
        this.activetab.set('description');
      }),
      switchMap((id) => this.productsService.getById(id).pipe(catchError(() => of(null)))),
      tap(() => this.loading.set(false)),
    ),
    { initialValue: null },
  );

  protected readonly images = computed(() => {
    const product = this.product();
    return product ? [...new Set([product.imageUrl, ...product.imageUrls])] : [];
  });

  protected readonly filledStars = computed(() => Math.round(this.product()?.rating ?? 0));
  protected readonly specs = computed(() => Object.entries(this.product()?.specifications ?? {}));



protected readonly related = toSignal(toObservable(this.product).pipe(
  filter((product)=>product!==null),switchMap((product)=>this.productsService.getFiltered({take:5,page:1,categoryId:product.category.id}).pipe(
    map((result)=>result.items.filter((item)=>item.id !==product.id).slice(0,4)),
    catchError(()=>of([]))
  ))

  )


  ,{initialValue:[]}
)



  protected addToCart(productId: number): void {
    this.cartService.addToCart(productId);
  }

  protected decreaseQuantity(): void {
    this.quantity.update((value) => value - 1);
  }

  protected increaseQuantity(stock: number): void {
    this.quantity.update((value) => Math.min(value + 1, stock));
  }

  protected addCurrentToCart(productId: number): void {
    this.cartService.addToCart(productId, this.quantity());
  }

  protected toggleFavorite(productId: number): void {
    this.favoritesService.toggle(productId);
  }
}
