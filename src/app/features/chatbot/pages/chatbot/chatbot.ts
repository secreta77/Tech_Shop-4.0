import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ChatWindow } from '../../components/chat-window/chat-window';
import { ChatbotService } from '../../data-access/chatbot.service';

@Component({
  selector: 'app-chatbot',
  imports: [ChatWindow],
  templateUrl: './chatbot.html',
  styleUrl: './chatbot.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chatbot {
  private readonly chatbotService = inject(ChatbotService);

  protected readonly open = signal(false);
  protected readonly messages = this.chatbotService.messages;
  protected readonly busy = this.chatbotService.busy;

  protected toggle(): void {
    this.open.update((value) => !value);
  }

  protected send(text: string): void {
    this.chatbotService.send(text);
  }

  protected clear(): void {
    this.chatbotService.reset();
  }
}
