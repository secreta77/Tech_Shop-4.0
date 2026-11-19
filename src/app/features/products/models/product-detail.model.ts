import { Product } from './product.model';

export interface ProductDetail extends Product {
  description: string;
  imageUrls: string[];
  specifications: Record<string, string>;
}
