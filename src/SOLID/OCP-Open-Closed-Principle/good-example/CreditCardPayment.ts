import { IPaymentProcessor } from './PaymentMethod';

export const CreditCardPayment: IPaymentProcessor = {
  name: 'credit-card',
  fee: 2,
  validate(data: unknown): boolean {
    const cardData = data as { cvv: string };
    if (!cardData || cardData.cvv.length < 3) console.log('please verify your CVV number');
    return true;
  },
  process(amount: number): void {
    const feeAmount = (amount * this.fee) / 100;
    console.log(
      `Processing credit card payment of $${amount} with a fee of $${feeAmount}`
    );
  },
};
