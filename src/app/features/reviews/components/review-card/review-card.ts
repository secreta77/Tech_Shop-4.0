import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Review } from '../../models/review.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-review-card',
  imports: [DatePipe],
  templateUrl: './review-card.html',
  styleUrl: './review-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewCard {
  review = input.required<Review>()
  isMine = input(false)

  fullName = computed(()=>`${this.review().user.firstName} ${this.review().user.lastName}`)

  initial = computed(()=>this.review().user.firstName.charAt(0).toUpperCase())
  stars = [1, 2, 3, 4, 5];
}
