import { INotificationService } from '../types/notification.type';

export class NotificationService implements INotificationService {
  send(message: string): string {
    return `Sending: ${message}`;
  }
}
