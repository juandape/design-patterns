'use client';

import { useNotificationObserver } from './useNotificationObserver.hook';

export const NotificationObserverOne = () => {
  const message = useNotificationObserver();

  return (
    <div className='border p-1 flex'>
      <h2>Notification Observer One:</h2>
      <p className='font-bold ml-5'>{message}</p>
    </div>
  );
};
