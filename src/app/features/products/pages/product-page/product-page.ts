import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { ReviewsSection } from '../../../reviews/pages/reviews-section/reviews-section';
import { ProductsService } from '../../data-access/products.service';

@Component({
  selector: 'app-product-page',
  imports: [DecimalPipe, NgOptimizedImage, RouterLink, ReviewsSection],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPage {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);

  protected readonly loading = signal(true);
  protected readonly selectedImage = signal(0);
  protected readonly stars = [1, 2, 3, 4, 5];

  protected readonly product = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('id'))),
      tap(() => {
        this.loading.set(true);
        this.selectedImage.set(0);
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
}
