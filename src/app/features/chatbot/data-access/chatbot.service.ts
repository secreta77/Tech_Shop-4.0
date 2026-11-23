import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ProfileService } from '../../profile/data-access/profile.service';
import {
  ChatMessage,
  ClaudeMessage,
  ClaudeResponse,
  SavedChat,
  TextBlock,
  ToolResultBlock,
  ToolUseBlock,
} from '../models/chat.model';
import { ChatToolsService } from './chat-tools.service';

const MAX_ROUNDS = 6;
const MAX_HISTORY = 30;

function buildSystemPrompt(): string {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return `You are "STEP TECH Assistant", the chat helper of the STEP TECH online electronics shop.
Today's date is ${today}.
- Help customers find products, compare them, check details and stock, manage their cart and favorites, and place orders.
- Prices are in USD. Be concise, friendly and to the point.
- Reply in plain text only. Do not use markdown symbols such as ** or #. For lists use lines that start with a dash.
- Every product in tool results has a "link" field. When you mention a specific product, write it as [Product Name](link), copying the link value exactly. Do not use any other links.
- Always use the tools to get real data. Never invent products, prices or stock.
- When you mention a product, include its name and price.
- If a tool result says the customer is not logged in, tell them to sign in first and do not retry the tool.
- Before calling the checkout tool you MUST first summarize the cart (items, quantities, total price) and ask the customer to confirm. Only call checkout after they clearly confirm in a later message. Never call it on the first mention of ordering.
- Never ask the customer for their password, verification codes or any credentials in chat.
- If the question is not about the shop, politely say you can only help with shopping.`;
}

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {
  private readonly http = inject(HttpClient);
  private readonly toolsService = inject(ChatToolsService);
  private readonly profileService = inject(ProfileService);

  private conversation: ClaudeMessage[] = [];
  private nextId = 1;

  readonly messages = signal<ChatMessage[]>([]);
  readonly busy = signal(false);

  private readonly storageKey = computed(
    () => `chat:${this.profileService.currentUser()?.id ?? 'guest'}`,
  );

  constructor() {
    toObservable(this.storageKey)
      .pipe(takeUntilDestroyed())
      .subscribe((key) => this.load(key));
  }

  reset(): void {
    this.conversation = [];
    this.messages.set([]);
    this.nextId = 1;
    this.save();
  }

  async send(text: string): Promise<void> {
    const question = text.trim();
    if (!question || this.busy()) {
      return;
    }

    this.addMessage('user', question);
    this.conversation.push({ role: 'user', content: question });
    this.busy.set(true);

    try {
      for (let round = 0; round < MAX_ROUNDS; round++) {
        const response = await this.askModel();
        this.conversation.push({ role: 'assistant', content: response.content });

        const answer = response.content
          .filter((block): block is TextBlock => block.type === 'text')
          .map((block) => block.text)
          .join('\n')
          .trim();

        if (answer) {
          this.addMessage('assistant', answer);
        }

        if (response.stop_reason !== 'tool_use') {
          return;
        }

        const toolCalls = response.content.filter(
          (block): block is ToolUseBlock => block.type === 'tool_use',
        );

        const results: ToolResultBlock[] = await Promise.all(
          toolCalls.map(async (call) => ({
            type: 'tool_result' as const,
            tool_use_id: call.id,
            content: await this.toolsService.execute(call.name, call.input),
          })),
        );

        this.conversation.push({ role: 'user', content: results });
      }

      this.addMessage('assistant', 'Sorry, that took too many steps. Please try asking in a simpler way.');
    } catch {
      this.addMessage('assistant', 'Sorry, something went wrong. Please try again in a moment.');
    } finally {
      this.busy.set(false);
      this.save();
    }
  }

  private askModel(): Promise<ClaudeResponse> {
    this.trimConversation();

    return firstValueFrom(
      this.http.post<ClaudeResponse>(environment.chatProxyUrl, {
        system: buildSystemPrompt(),
        messages: this.conversation,
        tools: this.toolsService.definitions,
        max_tokens: 800,
      }),
    );
  }

  private trimConversation(): void {
    if (this.conversation.length <= MAX_HISTORY) {
      return;
    }

    const start = this.conversation.findIndex(
      (message, index) =>
        index >= this.conversation.length - MAX_HISTORY &&
        message.role === 'user' &&
        typeof message.content === 'string',
    );

    if (start > 0) {
      this.conversation = this.conversation.slice(start);
    }
  }

  private load(key: string): void {
    try {
      const saved = sessionStorage.getItem(key);
      const data = saved ? (JSON.parse(saved) as SavedChat) : null;

      this.conversation = data?.conversation ?? [];
      this.messages.set(data?.messages ?? []);
      this.nextId = (data?.messages.at(-1)?.id ?? 0) + 1;
    } catch {
      this.conversation = [];
      this.messages.set([]);
      this.nextId = 1;
    }
  }

  private save(): void {
    try {
      const data: SavedChat = { conversation: this.conversation, messages: this.messages() };
      sessionStorage.setItem(this.storageKey(), JSON.stringify(data));
    } catch {
      return;
    }
  }

  private addMessage(role: 'user' | 'assistant', text: string): void {
    this.messages.update((list) => [...list, { id: this.nextId++, role, text }]);
  }
}
