import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Review } from '../../models/review.model';

@Component({
  selector: 'app-reviews-summary',
  imports: [DecimalPipe],
  templateUrl: './reviews-summary.html',
  styleUrl: './reviews-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsSummary {
  reviews = input.required<Review[]>();

  total = computed(() => this.reviews().length);

  average = computed(() => {
    const total = this.total();
    if (total === 0) {
      return 0;
    }
    const sum = this.reviews().reduce((acc, review) => acc + review.rating, 0);
    return sum / total;
  });

  filledStars = computed(() => Math.round(this.average()));

  rows = computed(() => {
    const total = this.total();
    return [5, 4, 3, 2, 1].map((star) => {
      const count = this.reviews().filter((review) => review.rating === star).length;
      return { star, count, percent: total === 0 ? 0 : (count / total) * 100 };
    });
  });

  stars = [1, 2, 3, 4, 5];
}
