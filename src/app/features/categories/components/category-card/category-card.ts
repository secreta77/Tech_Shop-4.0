import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-card',
  imports: [],
  templateUrl: './category-card.html',
  styleUrl: './category-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryCard {
  readonly category = input.required<Category>();
}
