import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../products/models/product.model';

@Component({
  selector: 'app-favorite-card',
  imports: [DecimalPipe, NgOptimizedImage, RouterLink],
  templateUrl: './favorite-card.html',
  styleUrl: './favorite-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteCard {
  product = input.required<Product>();

  addToCart = output<number>();
  removed = output<number>();

  stars = [1, 2, 3, 4, 5];
  filledStars = computed(() => Math.round(this.product().rating));
  soldOut = computed(() => this.product().stock === 0);
  lowStock = computed(() => this.product().stock > 0 && this.product().stock <= 5);
}
