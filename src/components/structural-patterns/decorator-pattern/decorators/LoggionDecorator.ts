import { BaseNotificationDecorator } from '../classes/baseNotification';

export class LoggingDecorator extends BaseNotificationDecorator {
  send(message: string): string {
    const baseMessage = super.send(message);
    console.log(`Logging message: ${baseMessage}`);
    return baseMessage;
  }
}