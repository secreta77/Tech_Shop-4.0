import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../auth/data-access/auth.service';
import { ProfileService } from '../../../profile/data-access/profile.service';
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
  private readonly profileService = inject(ProfileService);

  productId = input.required<number>();

  changed = output<void>();

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

  protected readonly myReview = computed(() =>
    this.reviews().find((review) => review.user.id === this.profileService.currentUser()?.id),
  );

  protected readonly orderedReviews = computed(() => {
    const mine = this.myReview();
    return mine ? [mine, ...this.reviews().filter((review) => review.id !== mine.id)] : this.reviews();
  });

  protected onSubmit(rate: number): void {
    this.saving.set(true);

    const mine = this.myReview();
    const request = mine
      ? this.reviewsService.update(mine.id, rate)
      : this.reviewsService.create(this.productId(), rate);

    request.subscribe({
      next: () => {
        this.toastService.success(mine ? 'Review updated successfully!' : 'Review submitted successfully!');
        this.formOpen.set(false);
        this.saving.set(false);
        this.reloadKey.update((key) => key + 1);
        this.changed.emit();
      },
      error: () => this.saving.set(false),
    });
  }
}
