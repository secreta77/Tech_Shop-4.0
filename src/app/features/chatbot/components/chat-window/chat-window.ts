import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ChatMessage } from '../../models/chat.model';
import { MessagePartsPipe } from '../../pipes/message-parts.pipe';

@Component({
  selector: 'app-chat-window',
  imports: [RouterLink, MessagePartsPipe],
  templateUrl: './chat-window.html',
  styleUrl: './chat-window.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatWindow {
  messages = input<ChatMessage[]>([]);
  busy = input(false);

  sent = output<string>();
  cleared = output<void>();
  closed = output<void>();

  protected readonly draft = signal('');

  protected readonly suggestions = [
    'Show me the best rated laptops',
    'Find headphones under $300',
    "What's in my cart?",
    'Which phones are in stock?',
  ];

  private readonly body = viewChild<ElementRef<HTMLElement>>('body');

  constructor() {
    afterRenderEffect(() => {
      this.messages();
      this.busy();
      const element = this.body()?.nativeElement;
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    });
  }

  protected onInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  protected submit(): void {
    const text = this.draft().trim();
    if (!text || this.busy()) {
      return;
    }

    this.sent.emit(text);
    this.draft.set('');
  }

  protected ask(text: string): void {
    if (!this.busy()) {
      this.sent.emit(text);
    }
  }
}
