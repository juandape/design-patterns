import { INotificationChannel } from '../types/notificationChannel.type';

export class SMS implements INotificationChannel {
  sendNotification(message: string): void {
    console.log(`Sending SMS notification: ${message}`);
  }
}
