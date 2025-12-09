import { INotificationChannel } from '../types/notificationChannel.type';

export class Push implements INotificationChannel {
  sendNotification(message: string): void {
    console.log(`Sending push notification: ${message}`);
  }
}
