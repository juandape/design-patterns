'use client';

import { useState } from 'react';
import { ChatRoom } from './chatRoom';
import { ChatUser } from './chatUser';
import { Message } from './types/message.type';

const users = [
  {
    name: 'Alice',
  },
  {
    name: 'Bob',
  },
  {
    name: 'Charlie',
  },
];

export const ChatRoomComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [chatRoom] = useState(() => new ChatRoom());

  const handleReceive = (to: string) => (content: string, from: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        from,
        to,
        content,
      },
    ]);
  };

  const [usersState] = useState(() => {
    const createdUsers = users.map(
      (user) => new ChatUser(user.name, chatRoom, handleReceive(user.name))
    );
    for (const user of createdUsers) {
      chatRoom.register(user);
    }
    return createdUsers;
  });

  const [selectedUser, setSelectedUser] = useState<ChatUser>(usersState[0]);

  const handleSendMessage = () => {
    if (message.trim()) {
      selectedUser.send(message);
      setSentMessages((prev) => [
        ...prev,
        {
          id: Date.now() + Math.random(),
          from: selectedUser.name,
          to: 'sent',
          content: message,
        },
      ]);
      setMessage('');
    }
  };

  return (
    <div className='border mt-4 p-4 w-[400px] ml-5 bg-white rounded-lg shadow-lg'>
      <h2 className='font-bold mb-4 text-lg border-b pb-2 text-black'>
        Chat Room - Mediator Pattern
      </h2>

      <div className='mb-3'>
        <label
          htmlFor='user-select'
          className='block mb-1 text-sm text-gray-600'
        >
          Chatting as:
        </label>
        <select
          id='user-select'
          value={selectedUser.name}
          onChange={(e) => {
            const user = usersState.find((u) => u.name === e.target.value);
            if (user) setSelectedUser(user);
          }}
          className='border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black'
        >
          {usersState.map((user) => (
            <option key={user.name} value={user.name} className='text-gray-500'>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <div className='bg-gray-50 p-4 rounded-lg h-80 overflow-y-auto mb-3 flex flex-col gap-2'>
        {messages.filter((msg) => msg.to === selectedUser.name).length === 0 &&
        sentMessages.filter((msg) => msg.from === selectedUser.name).length ===
          0 ? (
          <p className='text-gray-600 text-center text-sm mt-8'>
            No messages yet...
          </p>
        ) : (
          <>
            {messages
              .filter((msg) => msg.to === selectedUser.name)
              .map((msg) => (
                <div key={msg.id} className='flex justify-start'>
                  <div className='max-w-[75%] bg-white rounded-lg px-3 py-2 shadow-sm'>
                    <p className='font-semibold text-xs text-blue-600 mb-1'>
                      {msg.from}
                    </p>
                    <p className='text-sm text-gray-800'>{msg.content}</p>
                  </div>
                </div>
              ))}
            {sentMessages
              .filter((msg) => msg.from === selectedUser.name)
              .map((msg) => (
                <div key={msg.id} className='flex justify-end'>
                  <div className='max-w-[75%] bg-blue-500 text-white rounded-lg px-3 py-2 shadow-sm'>
                    <p className='font-semibold text-xs mb-1'>You</p>
                    <p className='text-sm'>{msg.content}</p>
                  </div>
                </div>
              ))}
          </>
        )}
      </div>

      <div className='flex gap-2'>
        <input
          type='text'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder='Type a message...'
          className='flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600 placeholder:text-gray-400'
        />
        <button
          onClick={handleSendMessage}
          className='bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition-colors font-medium'
        >
          Send
        </button>
      </div>
    </div>
  );
};
