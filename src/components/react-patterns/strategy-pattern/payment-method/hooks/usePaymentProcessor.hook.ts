'use client';

import { PaymentMethod } from '../types/paymenMethod.type';
import { useRef, useState } from 'react';
import { PaymentProcessor } from '../components/context/paymentProcessor';

export const usePaymentProcessor = (initialPaymentMethod: PaymentMethod) => {
  const [amount, setAmount] = useState(0);

  const processor = useRef(new PaymentProcessor(initialPaymentMethod));

  const updatePaymentMethod = (newPaymentMethod: PaymentMethod) => {
    processor.current.setPaymentMethod(newPaymentMethod);
  };

  const processPayment = () => {
    return processor.current.processPayment(amount);
  };

  return {
    amount,
    setAmount,
    processPayment,
    updatePaymentMethod,
  };
};
