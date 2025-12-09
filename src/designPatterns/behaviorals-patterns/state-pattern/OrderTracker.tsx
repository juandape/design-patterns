'use client';

import { useState } from 'react';
import { Order } from './Order';
import { PendingState } from './states/PendingState';
import { State } from './types/state.type';

export const OrderTracker = () => {
  const initialOrder = new Order(null as unknown as State);
  initialOrder.setState(new PendingState(initialOrder));

  const [order] = useState<Order>(initialOrder);
  const [currentStatus, setCurrentStatus] = useState(initialOrder.getStatus());

  const handleNext = () => {
    order.next();
    setCurrentStatus(order.getStatus());
  };

  const handlePrev = () => {
    order.prev();
    setCurrentStatus(order.getStatus());
  };

  return (
    <div className='border mt-4 p-4 w-96 ml-5'>
      <div>
        <h2>Order Tracker - State Pattern</h2>
        <h3 className='mt-2'>Currrent status: {currentStatus}</h3>
      </div>
      <div className='flex justify-between'>
        <button
          onClick={handleNext}
          className='bg-gray-500 text-white px-4 py-2 rounded cursor-pointer'
        >
          Next
        </button>
        <button
          onClick={handlePrev}
          className='bg-blue-500 text-white px-4 py-2 rounded cursor-pointer'
        >
          Previous
        </button>
      </div>
    </div>
  );
};
