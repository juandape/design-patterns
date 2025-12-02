import { PaymentMethod } from "../../types/paymenMethod.type";

export class PaymentProcessor {
  private paymentMethod: PaymentMethod;

  constructor(paymentMethod: PaymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  setPaymentMethod(paymentMethod: PaymentMethod) {
    this.paymentMethod = paymentMethod;
  }

  processPayment(amount: number): string {
    if (!this.paymentMethod.methodStatus) {
      return `Payment method ${this.paymentMethod.name} is not active.`;
    }
    return this.paymentMethod.pay(amount);
  }
}