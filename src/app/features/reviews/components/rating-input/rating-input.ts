import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-rating-input',
  imports: [],
  templateUrl: './rating-input.html',
  styleUrl: './rating-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingInput {
  value = input(0);

  rated = output<number>();

  hovered = signal(0);

  stars = [1, 2, 3, 4, 5];
}
