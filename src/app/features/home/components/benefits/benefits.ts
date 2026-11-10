import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Benefit } from '../../models/benefit.model';

@Component({
  selector: 'app-benefits',
  imports: [],
  templateUrl: './benefits.html',
  styleUrl: './benefits.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Benefits {
  readonly items = input.required<Benefit[]>();
}
