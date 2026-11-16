export interface ProductQuery {
  take: number;
  page: number;
  sortBy?: string;
  sortDescending?: boolean;
  search?: string;
  brand?: string;
  inStock?: boolean;
  categoryId?: number;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
}


  