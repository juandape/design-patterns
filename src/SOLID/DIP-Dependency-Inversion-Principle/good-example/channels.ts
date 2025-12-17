import { NotificationChannel } from './NotificationChannel';

export const emailChannel: NotificationChannel = (message) => {
  console.log(`📧 Email sent: ${message}`);
};

export const smsChannel: NotificationChannel = (message) => {
  console.log(`📱 SMS sent: ${message}`);
};

export const pushChannel: NotificationChannel = (message) => {
  console.log(`📲 Push notification sent: ${message}`);
};

export const telegramChannel: NotificationChannel = (message) => {
  console.log(`📨 Telegram message sent: ${message}`);
}
