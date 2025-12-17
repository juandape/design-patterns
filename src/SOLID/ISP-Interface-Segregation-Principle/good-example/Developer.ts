import { ICoder, IEmployee, IReporter, IWorker } from './interfaces';

export class Developer implements IWorker, ICoder, IReporter, IEmployee {
  work(): void {
    console.log("Developer is working");
  }

  code(): void {
    console.log("Developer is coding");
  }

  reportProgress(): string {
    console.log("Developer is reporting progress");
    return "Progress reported";
  }

  takeBreak(): void {
    console.log("Developer is taking a break");
  }

  payTax(): void {
    console.log("Developer is paying taxes");
  }
}