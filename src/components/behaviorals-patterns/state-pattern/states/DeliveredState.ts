import { Order } from '../Order';
import { State } from '../types/state.type';
import { ShippedState } from './ShippedState';

export class DeliveredState implements State {
  private readonly order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  next() {
    console.log('DeliveredState: No next state.');
  }

  prev() {
    this.order.setState(new ShippedState(this.order));
  }

  getStatus(): string {
    return 'Delivered';
  }
}
