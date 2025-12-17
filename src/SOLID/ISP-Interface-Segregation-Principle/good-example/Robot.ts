import { IWorker } from './interfaces';

export class Robot implements IWorker {
  work(): void {
    console.log('Robot is working');
  }
}
