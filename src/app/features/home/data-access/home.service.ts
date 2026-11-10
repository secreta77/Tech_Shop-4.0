import { inject, Injectable } from '@angular/core';
import { map } from 'rxjs';
import { CategoriesService } from '../../categories/data-access/categories.service';
import { ProductsService } from '../../products/data-access/products.service';
import { Benefit } from '../models/benefit.model';

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

  readonly benefits: Benefit[] = [
    { icon: 'bi bi-truck', title: 'Free Shipping', text: 'On orders over $100' },
    { icon: 'bi bi-shield-check', title: 'Secure Payment', text: '100% secure transactions' },
    { icon: 'bi bi-arrow-repeat', title: 'Easy Returns', text: '30-day return policy' },
    { icon: 'bi bi-headset', title: '24/7 Support', text: 'Dedicated customer care' },
  ];
}
