import { Observer } from './observer.type';
import { useState, useEffect } from 'react';
import { notificationServiceSingleton } from './NotificationServiceSingleton';

export const useNotificationObserver = () => {
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    const observer: Observer = {
      update: (newMessage: string) => {
        setMessage(newMessage);
      },
    };
    notificationServiceSingleton.subscribe(observer);
    return () => {
      notificationServiceSingleton.unsubscribe(observer);
    };
  }, []);

  return message;
};