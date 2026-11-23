import { Pipe, PipeTransform } from '@angular/core';
import { MessagePart } from '../models/chat.model';

const PRODUCT_LINK = /\[([^\]]+)\]\((\/products\/\d+)\)/g;

@Pipe({
  name: 'messageParts',
})
export class MessagePartsPipe implements PipeTransform {
  transform(text: string): MessagePart[] {
    const parts: MessagePart[] = [];
    let last = 0;

    for (const match of text.matchAll(PRODUCT_LINK)) {
      if (match.index > last) {
        parts.push({ text: text.slice(last, match.index), url: null });
      }

      parts.push({ text: match[1], url: match[2] });
      last = match.index + match[0].length;
    }

    if (last < text.length) {
      parts.push({ text: text.slice(last), url: null });
    }

    return parts;
  }
}
