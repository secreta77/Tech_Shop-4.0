import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../features/auth/data-access/auth.service';
import { CartDrawer } from '../../features/cart/components/cart-drawer/cart-drawer';
import { FavoritesService } from '../../features/favorites/data-access/favorites.service';
import { CartService } from '../../features/cart/data-access/cart.service';
import { ProfileService } from '../../features/profile/data-access/profile.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink,RouterLinkActive,CartDrawer],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class Header {
  private readonly authService = inject(AuthService)
  private readonly router = inject(Router)
  private readonly profileService = inject(ProfileService)
  private readonly cartService = inject(CartService)
  private readonly favoritesService = inject(FavoritesService)



protected isLoggedIn = this.authService.isLoggedIn

protected readonly cartCount = this.cartService.count

protected readonly favoriteCount = this.favoritesService.count

protected readonly cartOpen = signal(false)

protected readonly cartItems = this.cartService.items
protected readonly cartTotal = this.cartService.total


protected  changeQuantity(change: {itemId:number,quantity:number}):void{
  this.cartService.changeQuantity(change.itemId,change.quantity)
}

protected removeFromCart(itemId:number):void{
  this.cartService.removeItem(itemId)
}


protected logout():void{
  this.authService.logout();
  this.router.navigate(['/'])


}


protected readonly initials = computed(()=>{
  const user = this.profileService.currentUser()
  return user ? (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase() : ''
}) 


protected search(term: string): void {
  this.router.navigate(['/shop'], { queryParams: { search: term.trim() || null, page: null } })
}

}
