import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { ReviewCard } from '../../components/review-card/review-card';
import { ReviewsService } from '../../data-access/reviews.service';

@Component({
  selector: 'app-reviews-section',
  imports: [ReviewCard],
  templateUrl: './reviews-section.html',
  styleUrl: './reviews-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsSection {
  private readonly reviewsService = inject(ReviewsService);

  productId = input.required<number>();

  private readonly page = toSignal(
    toObservable(this.productId).pipe(
      switchMap((id) => this.reviewsService.getByProduct(id).pipe(catchError(() => of(null)))),
    ),
    { initialValue: null },
  );

  reviews = computed(() => this.page()?.items ?? []);
}
