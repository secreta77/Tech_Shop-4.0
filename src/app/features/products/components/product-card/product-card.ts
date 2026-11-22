import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  imports: [NgOptimizedImage, DecimalPipe, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCard {
  readonly product = input.required<Product>();
  readonly priority = input(false);
  readonly addToCart = output<number>();
  readonly stars = [1, 2, 3, 4, 5];
  readonly filledStars = computed(() => Math.round(this.product().rating));
  readonly soldOut = computed(() => this.product().stock === 0);
  readonly favorite = input(false);
  readonly favoriteToggle = output<number>();
}
