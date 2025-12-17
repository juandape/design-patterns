type NotificationService = 'email' | 'sms' | 'push';

export const sendEmail = (message: string): void => {
  console.log(`📧 Email sent: ${message}`);
};

export const sendSMS = (message: string): void => {
  console.log(`📱 SMS sent: ${message}`);
};

export const sendPush = (message: string): void => {
  console.log(`🔔 Push notification sent: ${message}`);
};

export const createNotificationService = (
  emailSender: (msg: string) => void,
  smsSender: (msg: string) => void,
  pushSender: (msg: string) => void
) => {
  return (channel: NotificationService, message: string) => {
    if(channel === 'email') {
      emailSender(message);
    } else if(channel === 'sms') {
      smsSender(message);
    } else if(channel === 'push') {
      pushSender(message);
    }
  };
};