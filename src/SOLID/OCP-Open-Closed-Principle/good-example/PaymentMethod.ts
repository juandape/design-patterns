export interface IPaymentProcessor {
  name: string,
  fee: number,
  validate(data: unknown): boolean,
  process(amount: number): void
}

