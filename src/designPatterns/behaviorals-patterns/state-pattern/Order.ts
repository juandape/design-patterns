import { State } from './types/state.type';

export class Order {
  private state: State;

  constructor(state: State) {
    this.state = state;
  }

  setState(state: State) {
    this.state = state;
  }

  next() {
    this.state.next();
  }

  prev() {
    this.state.prev();
  }

  getStatus() {
    return this.state.getStatus();
  }
}
