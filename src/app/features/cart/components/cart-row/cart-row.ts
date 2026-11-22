import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CartItem } from '../../models/cart-item.model';

@Component({
  selector: 'app-cart-row',
  imports: [DecimalPipe, NgOptimizedImage],
  templateUrl: './cart-row.html',
  styleUrl: './cart-row.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartRow {
  item = input.required<CartItem>();
  quantityChange = output<number>();
  removed = output<void>();
}
