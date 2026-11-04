import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ProductsService } from '../../../products/data-access/products.service';
import { CategoriesService } from '../../../categories/data-access/categories.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CategoryCard } from '../../../categories/components/category-card/category-card';


@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage,RouterLink,CategoryCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection:ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly categoryService = inject(CategoriesService)
  private readonly productService = inject(ProductsService)


  readonly categories = toSignal(this.categoryService.categories,{initialValue:[]})

  readonly featuredCategories = computed(() => this.categories().slice(0,4))

  readonly products = toSignal(this.productService.getProducts(4,1).pipe(map((page)=>page.items)),
  {initialValue :[]},


)


}
