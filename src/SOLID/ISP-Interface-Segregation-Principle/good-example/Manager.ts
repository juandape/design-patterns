import { IManager, IEmployee, IReporter, IWorker } from './interfaces';

export class Manager implements IEmployee, IManager, IReporter, IWorker {
  work(): void {
    console.log("Manager is working");
  }

  manage(): void {
    console.log("Manager is managing");
  }

  reportProgress(): string {
    console.log("Manager is reporting progress");
    return "Progress reported";
  }

  takeBreak(): void {
    console.log("Manager is taking a break");
  }

  payTax(): void {
    console.log("Manager is paying taxes");
  }
}