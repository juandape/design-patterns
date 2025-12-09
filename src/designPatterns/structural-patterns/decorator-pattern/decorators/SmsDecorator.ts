import { BaseNotificationDecorator } from '../classes/baseNotification';

export class SmsDecorator extends BaseNotificationDecorator {
  send(message: string): string {
    const baseMessage = super.send(message);
    return `${baseMessage} via SMS`;
  }
}