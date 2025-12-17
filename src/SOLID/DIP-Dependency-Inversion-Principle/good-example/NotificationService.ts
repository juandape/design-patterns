import { NotificationChannel } from './NotificationChannel';

export const NotificationService = (channel: NotificationChannel) => {
  return (message: string) => {
    channel(message);
  };
};
