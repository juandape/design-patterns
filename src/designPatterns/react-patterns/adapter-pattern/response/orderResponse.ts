export const apiOrderResponse = {
  order_id: 'A-991-X',
  total_amount: '150.00',
  currency_code: 'USD',
  state: 'PAID_SUCCESS',
  created_at: '2025/11/25 13:00:00',
  buyer: {
    full_name: 'John Doe',
    email_address: 'john.doe@example.com',
  },
  details: [
    {
      product_id: 'P100',
      product_name: 'Keyboard',
      quantity: 1,
      unit_price: '100',
    },
    {
      product_id: 'P200',
      product_name: 'Mouse',
      quantity: 1,
      unit_price: '50',
    },
  ],
};
