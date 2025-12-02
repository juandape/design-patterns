import { apiOrderResponse } from './response/orderResponse';
import { useOrder } from './hooks/useOrder.hook';

export const OrderDetails = () => {
  const { order } = useOrder(apiOrderResponse);

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {order.id}</p>
      <p>Status: {order.status}</p>
      <p>Email: {order.customerEmail}</p>
      <p>Customer Name: {order.customerName}</p>
      <p>
        Total Amount: ${order.amount} {order.currency}
      </p>
    </div>
  );
};
