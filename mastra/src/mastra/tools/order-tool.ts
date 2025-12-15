import { createTool } from "@mastra/core/tools";
import { z } from 'zod';
import ordersData from '../../mock/orders.json';


export interface Order {
  orderNumber: number;
  status: string;
  client: string;
  address: string;
  description: string;
  orderDate: string;
}

export const orderTool = createTool({
  id: "get-order",
  description: "Get order information by order number",
  inputSchema: z.object({
    orderNumber: z.number(),
  }),
  outputSchema: z.object({
    orderNumber: z.number(),
    status: z.string(),
    client: z.string(),
    address: z.string(),
    description: z.string(),
    orderDate: z.string(),
  }),
  execute: async ({context:{orderNumber}}) => {
    return await getOrder(orderNumber)
  }
});

const getOrder = async (orderNumber: number) => {
  const order = ordersData.find(order => order.orderNumber === orderNumber);
  if (!order) {
    throw new Error(`Order #${orderNumber} not found. Please verify the order number`);
  }
  return order;
};