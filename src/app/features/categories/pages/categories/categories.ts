import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CategoryCard } from '../../components/category-card/category-card';
import { CategoriesService } from '../../data-access/categories.service';

@Component({
  selector: 'app-categories',
  imports: [CategoryCard],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Categories {
  private readonly categoryService = inject(CategoriesService);

  protected readonly categories = toSignal(this.categoryService.categories, { initialValue: [] });
}
