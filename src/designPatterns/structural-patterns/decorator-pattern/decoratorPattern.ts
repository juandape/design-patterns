import { NotificationService } from './classes/notifcationService';
import { EmailDecorator } from './decorators/EmailDecorator';
import { LoggingDecorator } from './decorators/LoggionDecorator';
import { SmsDecorator } from './decorators/SmsDecorator';

export const decoratorPattern = () => {
  let notifier = new NotificationService();

  notifier = new EmailDecorator(notifier);
  notifier = new SmsDecorator(notifier);
  notifier = new LoggingDecorator(notifier);

  const result = notifier.send('Hello, Decorator Pattern!');
  console.log(result);

  return result;
};

decoratorPattern();