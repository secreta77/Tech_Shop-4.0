import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CartItem as CartItemModel } from '../../models/cart-item.model';
import { CartItem } from '../cart-item/cart-item';

@Component({
  selector: 'app-cart-drawer',
  imports: [CartItem, DecimalPipe],
  templateUrl: './cart-drawer.html',
  styleUrl: './cart-drawer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CartDrawer {
  open = input(false);
  items = input<CartItemModel[]>([]);
  count = input(0);
  total = input(0);

  closed = output<void>();
  quantityChange = output<{ itemId: number; quantity: number }>();
  removed = output<number>();
}
