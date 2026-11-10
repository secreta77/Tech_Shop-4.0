import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CategoryCard } from '../../../categories/components/category-card/category-card';
import { ProductCard } from '../../../products/components/product-card/product-card';
import { Benefits } from '../../components/benefits/benefits';
import { HomeService } from '../../data-access/home.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CategoryCard, ProductCard, Benefits],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly homeService = inject(HomeService);

  readonly featuredCategories = toSignal(this.homeService.featuredCategories$, { initialValue: [] });
  readonly products = toSignal(this.homeService.featuredProducts$, { initialValue: [] });
  readonly benefits = this.homeService.benefits;
}
