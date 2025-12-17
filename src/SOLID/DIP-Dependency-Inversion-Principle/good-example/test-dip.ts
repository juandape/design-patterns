import { NotificationService } from './NotificationService';
import {
  emailChannel,
  smsChannel,
  pushChannel,
  telegramChannel,
} from './channels';

const emailNotifier = NotificationService(emailChannel);
const smsNotifier = NotificationService(smsChannel);
const pushNotifier = NotificationService(pushChannel);
const telegramNotifier = NotificationService(telegramChannel);

console.log(emailNotifier('Hello via Email!'));
console.log(smsNotifier('Hello via SMS!'));
console.log(pushNotifier('Hello via Push Notification!'));
console.log(telegramNotifier('Hello via Telegram!'));
