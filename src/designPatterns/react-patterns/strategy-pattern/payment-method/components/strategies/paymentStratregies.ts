import { PaymentMethod } from "../../types/paymenMethod.type";

export class CreditCardPayment implements PaymentMethod {
  constructor(public name: string, public methodStatus: boolean) {}
  pay(amount: number): string {
    return `Paid ${amount} using Credit Card.`;
  }
}

export class DebitCardPayment implements PaymentMethod {
  constructor(public name:string, public methodStatus: boolean) {}
  pay(amount: number): string {
    return `Paid ${amount} using Debit Card.`;
  }
}

export class PayPalPayment implements PaymentMethod {
  constructor(public name: string, public methodStatus: boolean) {}
  pay(amount: number): string {
    return `Paid ${amount} using PayPal.`;
  }
}

export class BankTransferPayment implements PaymentMethod {
  constructor(public name: string, public methodStatus: boolean) {}
  pay(amount: number): string {
    return `Paid ${amount} using Bank Transfer.`;
  }
}

export class BitcoinPayment implements PaymentMethod {
  constructor(public name: string, public methodStatus: boolean) {}
  pay(amount: number): string {
    return `Paid ${amount} using Bitcoin.`;
  }
}