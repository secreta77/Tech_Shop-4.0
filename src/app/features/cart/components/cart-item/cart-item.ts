import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CartItem as CartItemModel } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart-item',
  imports: [DecimalPipe, NgOptimizedImage],
  templateUrl: './cart-item.html',
  styleUrl: './cart-item.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartItem {
  item = input.required<CartItemModel>();
  quantityChange = output<number>();
  removed = output<void>();
}
