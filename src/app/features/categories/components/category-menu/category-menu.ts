import { ChangeDetectionStrategy, Component, ElementRef, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-category-menu',
  imports: [RouterLink],
  templateUrl: './category-menu.html',
  styleUrl: './category-menu.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(document:keydown.escape)': 'close()',
  },
})
export class CategoryMenu {
  private readonly host = inject(ElementRef<HTMLElement>);

  categories = input<Category[]>([]);

  protected readonly open = signal(false);

  protected toggle(): void {
    this.open.update((value) => !value);
  }

  protected close(): void {
    this.open.set(false);
  }

  protected onDocumentClick(event: Event): void {
    if (!this.host.nativeElement.contains(event.target)) {
      this.close();
    }
  }
}
