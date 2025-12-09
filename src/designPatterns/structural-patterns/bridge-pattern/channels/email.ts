import { INotificationChannel } from '../types/notificationChannel.type';

export class Email implements INotificationChannel {
  sendNotification(message: string): void {
    console.log(`Sending email notification: ${message}`);
  }
}
