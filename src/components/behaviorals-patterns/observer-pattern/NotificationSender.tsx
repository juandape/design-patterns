'use client';

import { notificationServiceSingleton } from './NotificationServiceSingleton';
import { useState } from 'react';

export const NotificationSender = () => {
  const [inputMessage, setInputMessage] = useState('');
  const sendNotification = () => {
    notificationServiceSingleton.notify(inputMessage);
    setInputMessage('');
  };

  return (
    <div className='border p-1'>
      <h2>Notification Sender:</h2>
      <input
        type='text'
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        className='border rounded-sm p-1 mb-2'
        placeholder='write your message'
      />
      <button
        onClick={sendNotification}
        className='border rounded-sm bg-amber-700 ml-5 p-1'
      >
        Send Notification
      </button>
    </div>
  );
};
