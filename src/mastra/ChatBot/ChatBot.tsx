'use client';

import { useState } from 'react';

interface Message {
  role: string;
  content: string;
}

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState(null);

  const sendMessage = async () => {
    if (input.trim() === '') {
      return;
    }
    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          threadId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (data.response) {
        const botMessage = { role: 'assistant', content: data.response };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setThreadId(data.threadId);
      } else {
        console.error('No response in data:', data);
        const errorMessage = {
          role: 'assistant',
          content: 'Error: No response from bot',
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Error: Could not connect to bot',
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    }

    setInput('');
    setIsLoading(false);
  };

  return (
    <div className='mt-5 bg-white w-96 ml-5 h-96'>
      <ul className='overflow-y-auto h-72'>
        {messages.map((msg, index) => (
          <li
            key={index}
            className={
              msg.role === 'user'
                ? 'text-right text-blue-700 border my-2 rounded-2xl p-2 w-48 ml-auto mr-4'
                : 'text-left text-red-800 border my-2 rounded-2xl p-2 w-48 ml-4'
            }
          >
            {msg.content}
          </li>
        ))}
      </ul>
      <div className='flex justify-between px-4 mt-5 border-t border-gray-300 pt-2'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          className='border text-black px-3 py-1 rounded-full'
          placeholder='Type a message...'
        />
        <button
          onClick={sendMessage}
          disabled={isLoading}
          className='bg-blue-500 cursor-pointer hover:bg-blue-700 transition-all text-white px-4 py-2 duration-150 rounded-full'
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
};
