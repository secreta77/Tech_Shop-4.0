import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../auth/data-access/auth.service';
import { ReviewCard } from '../../components/review-card/review-card';
import { ReviewForm } from '../../components/review-form/review-form';
import { ReviewsSummary } from '../../components/reviews-summary/reviews-summary';
import { ReviewsService } from '../../data-access/reviews.service';

@Component({
  selector: 'app-reviews-section',
  imports: [ReviewCard, ReviewsSummary, ReviewForm, RouterLink],
  templateUrl: './reviews-section.html',
  styleUrl: './reviews-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewsSection {
  private readonly reviewsService = inject(ReviewsService);
  private readonly toastService = inject(ToastService);
  private readonly authService = inject(AuthService);

  productId = input.required<number>();

  protected readonly isLoggedIn = this.authService.isLoggedIn;
  protected readonly formOpen = signal(false);
  protected readonly saving = signal(false);
  private readonly reloadKey = signal(0);

  private readonly page = toSignal(
    toObservable(computed(() => ({ id: this.productId(), key: this.reloadKey() }))).pipe(
      switchMap(({ id }) => this.reviewsService.getByProduct(id).pipe(catchError(() => of(null)))),
    ),
    { initialValue: null },
  );

  reviews = computed(() => this.page()?.items ?? []);

  protected onSubmit(rate: number): void {
    this.saving.set(true);

    this.reviewsService.create(this.productId(), rate).subscribe({
      next: () => {
        this.toastService.success('Review submitted successfully!');
        this.formOpen.set(false);
        this.saving.set(false);
        this.reloadKey.update((key) => key + 1);
      },
      error: () => this.saving.set(false),
    });
  }
}
