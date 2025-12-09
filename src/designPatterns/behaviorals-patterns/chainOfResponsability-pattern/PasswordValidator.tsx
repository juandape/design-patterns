'use client';

import { useState, useMemo } from 'react';
import { LengthValidator } from './handlers/LengthValidator';
import { NumberValidator } from './handlers/NumberValidator';
import { UppercaseValidator } from './handlers/UppercaseValidator';

export const PasswordValidator = () => {
  const [password, setPassword] = useState('');
  const [validationResult, setValidationResult] = useState<string | null>(null);

  const validatorsChain = useMemo(() => {
    const lengthValidator = new LengthValidator();
    const uppercaseValidator = new UppercaseValidator();
    const numberValidator = new NumberValidator();

    lengthValidator.setNext(uppercaseValidator).setNext(numberValidator);
    return lengthValidator;
  }, []);

  const handleClick = () => {
    const result = validatorsChain.handle(password);
    setValidationResult(result);
  };

  return (
    <div className='border mt-4 p-4 w-96 ml-5'>
      <h2>Chain of Responsibility - Password Validator</h2>
      <label htmlFor='password' aria-label='password' className='block mb-2'>
        Password:
      </label>
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder='enter password'
        className='border rounded px-2 py-1 w-full'
      />
      <div className='mt-2'>
        {validationResult && <p className='text-red-500'>{validationResult}</p>}
        {password && !validationResult && (
          <p className='text-green-500'>Password is valid</p>
        )}
      </div>
      <button
        className='bg-blue-500 cursor-pointer p-2 rounded-2xl'
        onClick={handleClick}
      >
        Validate
      </button>
    </div>
  );
};
