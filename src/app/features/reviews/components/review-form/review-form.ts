import { ChangeDetectionStrategy, Component, input, linkedSignal, output, signal } from '@angular/core';
import { RatingInput } from '../rating-input/rating-input';

@Component({
  selector: 'app-review-form',
  imports: [RatingInput],
  templateUrl: './review-form.html',
  styleUrl: './review-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewForm {
  initialRating = input(0);
  isEdit = input(false);
  submitting = input(false);

  submitted = output<number>();
  cancelled = output<void>();

  rating = linkedSignal(() => this.initialRating());
  showError = signal(false);

  onRated(value: number): void {
    this.rating.set(value);
    this.showError.set(false);
  }

  submit(): void {
    if (this.rating() === 0) {
      this.showError.set(true);
      return;
    }
    this.submitted.emit(this.rating());
  }
}
