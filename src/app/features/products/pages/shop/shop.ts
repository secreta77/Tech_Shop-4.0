import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { CategoriesService } from '../../../categories/data-access/categories.service';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductsService } from '../../data-access/products.service';
import { ProductQuery } from '../../models/product-query.model';
import { ShopFilters } from '../../components/shop-filters/shop-filters';

@Component({
  selector: 'app-shop',
  imports: [ProductCard, Pagination,ShopFilters],
  templateUrl: './shop.html',
  styleUrl: './shop.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shop {
  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly params = toSignal(this.route.queryParamMap, {
    initialValue: this.route.snapshot.queryParamMap,
  });

  protected readonly categories = toSignal(this.categoriesService.categories, {
    initialValue: [],
  });

  protected readonly page = computed(() => this.numberParam('page') ?? 1);
  protected readonly pageSize = computed(() => this.numberParam('size') ?? 8);
  protected readonly categoryId = computed(() => this.numberParam('category'));
  protected readonly minRating = computed(()=>this.numberParam('rating'))
  protected readonly minPrice = computed(()=>this.numberParam("minPrice"))
  protected readonly maxPrice = computed(()=>this.numberParam("maxPrice"))
  protected readonly brand  = computed(()=>this.params().get("brand") ?? '')
  protected readonly inStock = computed(()=>this.params().get("inStock")==="true")

  private readonly query = computed<ProductQuery>(() => ({
    take: this.pageSize(),
    page: this.page(),
    sortBy: 'rating',
    sortDescending: true,
    search: this.params().get('search') ?? undefined,
    brand: this.brand() || undefined,
    inStock: this.inStock(),
    categoryId: this.categoryId(),
    minRating: this.minRating(),
    minPrice: this.minPrice(),
    maxPrice: this.maxPrice(),
  }));

  private readonly result = toSignal(
    toObservable(this.query).pipe(switchMap((query) => this.productsService.getFiltered(query))),
    { initialValue: null },
  );

  protected readonly products = computed(() => this.result()?.items ?? []);
  protected readonly totalPages = computed(() => this.result()?.totalPages ?? 1);
  protected readonly totalCount = computed(() => this.result()?.totalCount ?? 0);

  protected changePage(page: number): void {
    this.updateParams({ page });
  }

  protected changePageSize(size: number): void {
    this.updateParams({ size, page: 1 });
  }

  protected filterChange(changes: Params): void {
    this.updateParams({ ...changes, page: 1 });
  }

    protected clearFilters(): void {
      this.updateParams({
        category: null,
        rating: null,
        minPrice: null,
        maxPrice: null,
        brand: null,
        inStock: null,
        search: null,
        page: 1,
      });
    }

  protected updateParams(changes: Params): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: changes,
      queryParamsHandling: 'merge',
    });
  }

  private numberParam(name: string): number | undefined {
    const value = this.params().get(name);
    return value === null || value === '' ? undefined : Number(value);
  }
}
