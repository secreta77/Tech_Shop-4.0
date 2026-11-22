import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CategoryCard } from '../../../categories/components/category-card/category-card';
import { ProductCard } from '../../../products/components/product-card/product-card';
import { Benefits } from '../../components/benefits/benefits';
import { HomeService } from '../../data-access/home.service';
import { Hero } from '../../components/hero/hero';
import { CartService } from '../../../cart/data-access/cart.service';
import { FavoritesService } from '../../../favorites/data-access/favorites.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, CategoryCard, ProductCard, Benefits,Hero],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly homeService = inject(HomeService);
  private readonly cartService = inject(CartService);
  private readonly favoritesService = inject(FavoritesService);
  protected readonly favoriteIds = this.favoritesService.ids;

  readonly featuredCategories = toSignal(this.homeService.featuredCategories$, { initialValue: [] });
  readonly products = toSignal(this.homeService.featuredProducts$, { initialValue: [] });
  readonly benefits = this.homeService.benefits;

  protected addToCart(productId: number): void {
    this.cartService.addToCart(productId);
  }

  protected toggleFavorite(productId: number): void {
    this.favoritesService.toggle(productId);
  }
}
