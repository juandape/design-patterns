'use client';

import { bankTransfer, bitcoin, credit, debit, paypal } from './helpers';
import { usePaymentProcessor } from './hooks/usePaymentProcessor.hook';

export const Checkout = () => {
  const { amount, setAmount, processPayment, updatePaymentMethod } =
    usePaymentProcessor(credit);

  const handlePay = () => {
    alert(processPayment());
  };

  return (
    <div>
      <h1>Checkout</h1>
      <input
        type='text'
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <div className='flex gap-4'>
        <button onClick={() => updatePaymentMethod(credit)} className='p-2 bg-blue-300'>Credit Card</button>
        <button onClick={() => updatePaymentMethod(debit)} className='p-2 bg-blue-300'>Debit Card</button>
        <button onClick={() => updatePaymentMethod(paypal)} className='p-2 bg-blue-300'>PayPal</button>
        <button onClick={() => updatePaymentMethod(bitcoin)} className='p-2 bg-blue-300'>Bitcoin</button>
        <button onClick={() => updatePaymentMethod(bankTransfer)} className='p-2 bg-blue-300'>
          Bank Transfer
        </button>
        <button onClick={handlePay} className='p-2 bg-green-300 rounded-3xl'>Pay</button>
      </div>
    </div>
  );
};
