export interface PaymentMethod {
  name: string;
  pay(amount: number): string;
  methodStatus: boolean;
}