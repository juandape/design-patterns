import { Order } from '../Order';
import { State } from '../types/state.type';
import { PendingState } from './PendingState';
import { ShippedState } from './ShippedState';

export class ProcessingState implements State {
  private readonly order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  next() {
    this.order.setState(new ShippedState(this.order));
  }

  prev() {
    this.order.setState(new PendingState(this.order));
  }

  getStatus(): string {
    return 'Processing';
  }
}
