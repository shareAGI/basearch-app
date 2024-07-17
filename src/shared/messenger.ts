import { TypeContainer } from '@angularity/core';
import { Observable } from 'rxjs';

export interface MessageType<T extends string, P> {
  type: T;
  $payload: TypeContainer<P>;
}

export function define<T extends string, P>(
  type: T,
  $payload: TypeContainer<P>,
): MessageType<T, P> {
  return { type, $payload };
}

export function listen<T extends string, P>(
  type: MessageType<T, P>,
): Observable<P> {
  return new Observable((subscriber) => {
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type !== type.type) return;
      subscriber.next(message.$payload);
    });
  });
}

export function send<T extends string, P>(
  type: MessageType<T, P>,
  payload: NoInfer<P>,
): void;
export function send<T extends string>(type: MessageType<T, void>): void;
export function send<T extends string, P>(
  type: MessageType<T, P>,
  payload?: NoInfer<P>,
): void {
  chrome.runtime.sendMessage({ type: type.type, $payload: payload });
}
