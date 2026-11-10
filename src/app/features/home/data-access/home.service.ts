import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { CategoriesService } from '../../categories/data-access/categories.service';
import { ProductsService } from '../../products/data-access/products.service';

@Injectable({ providedIn: 'root' })
export class HomeService {
  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);

  readonly featuredCategories$ = this.categoriesService.categories.pipe(
    map((categories) => categories.slice(0, 4)),
  );

  readonly featuredProducts$ = this.productsService
    .getProducts(4, 1)
    .pipe(map((page) => page.items));
}
