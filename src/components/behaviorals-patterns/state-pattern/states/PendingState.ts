import { State } from '../types/state.type';
import { Order } from '../Order';
import { ProcessingState } from './ProcessingState';

export class PendingState implements State {
  private readonly order: Order;

  constructor(order: Order) {
    this.order = order;
  }

  next() {
    this.order.setState(new ProcessingState(this.order));
  }

  prev() {
    console.log('PendingState: No previous state.');
  }

  getStatus(): string {
    return 'Pending';
  }
}
