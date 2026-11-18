import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Category } from '../../../categories/models/category.model';

@Component({
  selector: 'app-shop-filters',
  imports: [],
  templateUrl: './shop-filters.html',
  styleUrl: './shop-filters.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShopFilters {
  readonly categories = input.required<Category[]>();
  readonly selectedCategory = input<number | undefined>(undefined);

  readonly minRating = input<number | undefined>(undefined);
  readonly minPrice = input<number | undefined>(undefined);
  readonly maxPrice = input<number | undefined>(undefined);

  readonly categoryChange = output<number | null>();
  readonly ratingChange = output<number | null>();
  readonly minPriceChange = output<number | null>();
  readonly maxPriceChange = output<number | null>();

  protected readonly ratings = [4, 3, 2, 1];
  protected readonly stars = [1, 2, 3, 4, 5];

  protected toggleCategory(id: number): void {
    this.categoryChange.emit(this.selectedCategory() === id ? null : id);
  }

  protected toggleRating(rating: number): void {
    this.ratingChange.emit(this.minRating() === rating ? null : rating);
  }

  protected onMinPrice(event: Event): void {
    this.minPriceChange.emit(this.toNumber(event));
  }

  protected onMaxPrice(event: Event): void {
    this.maxPriceChange.emit(this.toNumber(event));
  }

  private toNumber(event: Event): number | null {
    const value = (event.target as HTMLInputElement).value;
    return value === '' ? null : Number(value);
  }
}
