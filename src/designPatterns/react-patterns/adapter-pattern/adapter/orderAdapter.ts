import { ApiOrderDetail, ApiOrderResponse, Order } from '../types/order.type';

export class OrderAdapter {
  static fromApi(apiResponse: ApiOrderResponse): Order {
    return {
      id: apiResponse.order_id,
      amount: Number(apiResponse.total_amount),
      currency: apiResponse.currency_code,
      status: OrderAdapter.mapStatus(apiResponse.state),
      customerName: apiResponse.buyer.full_name,
      customerEmail: apiResponse.buyer.email_address,
      createdAt: new Date(apiResponse.created_at).toISOString(),
      items: apiResponse.details.map((item: ApiOrderDetail) => ({
        id: item.product_id,
        name: item.product_name,
        qty: item.quantity,
        price: Number(item.unit_price),
      })),
    };
  }

  private static mapStatus(apiStatus: string): Order['status'] {
    const map: Record<string, Order['status']> = {
      PAID_SUCCESS: 'paid',
      WAITING_PAYMENT: 'pending',
      ERROR_FAIL: 'failed',
    };

    return map[apiStatus] ?? 'pending';
  }
}