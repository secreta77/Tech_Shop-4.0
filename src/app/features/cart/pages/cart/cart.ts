import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartRow } from '../../components/cart-row/cart-row';
import { CartService } from '../../data-access/cart.service';

@Component({
  selector: 'app-cart',
  imports: [DecimalPipe, RouterLink, CartRow],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cart {
  private readonly cartService = inject(CartService);

  protected readonly items = this.cartService.items;
  protected readonly count = this.cartService.count;
  protected readonly total = this.cartService.total;
  protected readonly checkingOut = this.cartService.checkingOut;

  protected changeQuantity(itemId: number, quantity: number): void {
    this.cartService.changeQuantity(itemId, quantity);
  }

  protected remove(itemId: number): void {
    this.cartService.removeItem(itemId);
  }

  protected clear(): void {
    this.cartService.clear();
  }

  protected checkout(): void {
    this.cartService.checkout();
  }
}
