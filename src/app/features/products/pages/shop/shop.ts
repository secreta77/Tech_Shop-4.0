import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductsService } from '../../data-access/products.service';

@Component({
  selector: 'app-shop',
  imports: [ProductCard, Pagination],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shop {
  private readonly productsService = inject(ProductsService);

  protected readonly page = signal(1);
  protected readonly pageSize = signal(8);

  private readonly query = computed(() => ({
    take: this.pageSize(),
    page: this.page(),
    sortBy: 'rating',
    sortDescending: true,
  }));

  private readonly result = toSignal(
    toObservable(this.query).pipe(switchMap((query) => this.productsService.getFiltered(query))),
    { initialValue: null },
  );

  protected readonly products = computed(() => this.result()?.items ?? []);
  protected readonly totalPages = computed(() => this.result()?.totalPages ?? 1);
  protected readonly totalCount = computed(() => this.result()?.totalCount ?? 0);

  protected changePage(page: number): void {
    this.page.set(page);
  }

  protected changePageSize(size: number): void {
    this.pageSize.set(size);
    this.page.set(1);
  }
}
