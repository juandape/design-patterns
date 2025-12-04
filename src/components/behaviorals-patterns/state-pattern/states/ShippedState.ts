import { Order } from '../Order';
import { State } from '../types/state.type';
import { DeliveredState } from './DeliveredState';
import { ProcessingState } from './ProcessingState';

export class ShippedState implements State {
  private readonly order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  next() {
    this.order.setState(new DeliveredState(this.order));
  }

  prev() {
    this.order.setState(new ProcessingState(this.order));
  }

  getStatus(): string {
    return 'Shipped';
  }
}
