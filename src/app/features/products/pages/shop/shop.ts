import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { catchError, debounceTime, distinctUntilChanged, of, Subject, switchMap, tap } from 'rxjs';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { CategoriesService } from '../../../categories/data-access/categories.service';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductsService } from '../../data-access/products.service';
import { ProductQuery } from '../../models/product-query.model';
import { ShopFilters } from '../../components/shop-filters/shop-filters';
import { CartService } from '../../../cart/data-access/cart.service';


const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated', sortBy: 'rating', sortDescending: true },
  { value: 'newest', label: 'Newest', sortBy: 'createdAt', sortDescending: true },
  { value: 'price-asc', label: 'Price: Low to High', sortBy: 'price', sortDescending: false },
  { value: 'price-desc', label: 'Price: High to Low', sortBy: 'price', sortDescending: true },
  { value: 'name', label: 'Name: A to Z', sortBy: 'name', sortDescending: false },
];


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
  private readonly cartService = inject(CartService);

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
  protected readonly search = computed(()=>this.params().get("search")?? "")
  protected readonly sortOptions = SORT_OPTIONS
  protected readonly sort = computed(()=>this.params().get("sort") ?? "rating")
  




  private readonly sortOption = computed(()=> SORT_OPTIONS.find((option)=>option.value === this.sort()) ?? SORT_OPTIONS[0])


  private readonly query = computed<ProductQuery>(() => ({
    take: this.pageSize(),
    page: this.page(),
    sortBy: this.sortOption().sortBy,
    sortDescending: this.sortOption().sortDescending,
    search: this.search() || undefined,
    brand: this.brand() || undefined,
    inStock: this.inStock(),
    categoryId: this.categoryId(),
    minRating: this.minRating(),
    minPrice: this.minPrice(),
    maxPrice: this.maxPrice(),
  }));

  protected readonly loading = signal(true);
  protected readonly skeletons = Array.from({ length: 8 });

  private readonly result = toSignal(
    toObservable(this.query).pipe(
      tap(() => this.loading.set(true)),
      switchMap((query) =>
        this.productsService.getFiltered(query).pipe(catchError(() => of(null))),
      ),
      tap(() => this.loading.set(false)),
    ),
    { initialValue: null },
  );

  private readonly searchInput$ = new Subject<string>();

  constructor() {
    this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((term) => this.filterChange({ search: term.trim() || null }));
  }

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


    protected readonly activeFilters = computed(() => {
      const chips: { key: string; label: string }[] = [];

      const category = this.categories().find((item) => item.id === this.categoryId());
  
      if (category) chips.push({ key: 'category', label: `Category: ${category.name}` });
      if (this.minRating()) chips.push({ key: 'rating', label: `Rating: ${this.minRating()}★ & up` });

      if (this.minPrice() !== undefined) chips.push({ key: 'minPrice', label: `Min price: $${this.minPrice()}` });
      if (this.maxPrice() !== undefined) chips.push({ key: 'maxPrice', label: `Max price: $${this.maxPrice()}` });
      if (this.brand()) chips.push({ key: 'brand', label: `Brand: ${this.brand()}` });
      if (this.inStock()) chips.push({ key: 'inStock', label: 'In Stock only' });
      if (this.search()) chips.push({ key: 'search', label: `Search: ${this.search()}` });
  
      return chips;
    });
  

    protected removeFilter(key: string): void {
      this.filterChange({ [key]: null });
    }

  protected onSearch(event:Event):void{
    this.searchInput$.next((event.target as HTMLInputElement).value)
  }

  protected onSort(event:Event):void{
    this.filterChange({sort:(event.target as HTMLSelectElement).value})
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
        sort: null,
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

  protected addToCart(productId: number): void {
    this.cartService.addToCart(productId);
  }
}
