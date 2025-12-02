import { useMemo } from 'react';
import { OrderAdapter } from '../adapter/orderAdapter';
import { ApiOrderResponse, Order } from '../types/order.type';

export const useOrder = (apiResponse: ApiOrderResponse) => {
  const order = useMemo<Order | null>(() => {
    return OrderAdapter.fromApi(apiResponse);
  }, [apiResponse]);

  return { order };
};
