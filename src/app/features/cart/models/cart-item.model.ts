import { Product } from '../../products/models/product.model';

export interface CartItem {
  id: number;
  quantity: number;
  price: number;
  totalPrice: number;
  product: Product;
}