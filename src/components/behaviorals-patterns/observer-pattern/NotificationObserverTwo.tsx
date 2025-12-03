'use client';

import { useNotificationObserver } from './useNotificationObserver.hook';

export const NotificationObserverTwo = () => {
  const message = useNotificationObserver();

  return (
    <div className='border p-1 flex bg-red-500'>
      <h2>Notification Observer Two:</h2>
      <p className='font-bold ml-5'>{message}</p>
    </div>
  );
};
