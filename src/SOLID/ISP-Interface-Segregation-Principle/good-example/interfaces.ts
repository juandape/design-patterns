export interface IWorker {
  work(): void;
}

export interface IManager {
  manage(): void;
}

export interface ICoder {
  code(): void;
}

export interface IReporter {
  reportProgress(): string;
}

export interface IEmployee {
  takeBreak(): void;
  payTax(): void;
}