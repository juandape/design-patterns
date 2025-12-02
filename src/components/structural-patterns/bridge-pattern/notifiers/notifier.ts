import { INotificationChannel } from '../types/notificationChannel.type';

export abstract class Notifier {
  protected channel: INotificationChannel;

  constructor(channel: INotificationChannel) {
    this.channel = channel;
  }

  abstract notify(message: string): void;
}
