'use client';

import { useEffect, useState } from 'react';
import { AuthService } from './components/AuthService/authService';

export const AuthTest = () => {
  const auth = AuthService.getInstance();
  const [token, setToken] = useState(auth.getToken());
  const [time, setTime] = useState(auth.getRemainingTime());

  useEffect(() => {
    const interval = setInterval(() => {
      setToken(auth.getToken());
      setTime(auth.getRemainingTime());
    }, 500);

    return () => clearInterval(interval);
  }, [auth]);

  return (
    <div className='flex flex-col mt-20 w-96 p-5 border gap-5'>
      <button onClick={() => auth.setToken('XYZ', 5)} className='bg-blue-300 w-40 rounded-md transition-all cursor-pointer hover:bg-amber-600'>Set token for 5s</button>
      <button onClick={() => auth.clearToken()} className='bg-red-300 w-40 rounded-md transition-all cursor-pointer hover:bg-pink-500'>Clear token</button>

      <p>Token: {token}</p>
      <p>Expires in: {time}ms</p>
      <p>Valid: {auth.isTokenValid() ? 'Yes' : 'No'}</p>
    </div>
  );
};
