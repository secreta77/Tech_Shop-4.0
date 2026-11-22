import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../cart/data-access/cart.service';
import { FavoriteCard } from '../../components/favorite-card/favorite-card';
import { FavoritesService } from '../../data-access/favorites.service';

@Component({
  selector: 'app-favorites',
  imports: [RouterLink, FavoriteCard],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Favorites {
  private readonly favoritesService = inject(FavoritesService);
  private readonly cartService = inject(CartService);

  protected readonly items = this.favoritesService.items;

  protected addToCart(productId: number): void {
    this.cartService.addToCart(productId);
  }

  protected remove(productId: number): void {
    this.favoritesService.toggle(productId);
  }

  protected clear(): void {
    this.favoritesService.clear();
  }
}
