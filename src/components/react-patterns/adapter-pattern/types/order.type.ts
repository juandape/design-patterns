export interface Order {
  id: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed";
  customerName: string;
  customerEmail: string;
  createdAt: string; // ISO normalizado
  items: {
    id: string;
    name: string;
    qty: number;
    price: number;
  }[];
}

export interface ApiOrderDetail {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: string | number;
}

export interface ApiOrderResponse {
  order_id: string;
  total_amount: string | number;
  currency_code: string;
  state: string;
  buyer: {
    full_name: string;
    email_address: string;
  };
  created_at: string;
  details: ApiOrderDetail[];
}