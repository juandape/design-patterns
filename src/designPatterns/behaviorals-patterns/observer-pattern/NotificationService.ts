import { Observer } from './observer.type';

export class NotificationService {
  private observers: Observer[] = [];

  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(message: string) {
    for (const observer of this.observers) {
      observer.update(message);
    }
  }
}
