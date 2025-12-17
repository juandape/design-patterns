import { IPaymentProcessor } from './PaymentMethod';

export const PayPalPayment: IPaymentProcessor = {
  name: 'paypal',
  fee: 3,
  validate(data: unknown): boolean {
    const cardData = data as { email: string };
    if (!cardData || !cardData.email) console.log('please verify your email');
    return true;
  },
  process(amount: number): void {
    const feeAmount = (amount * this.fee) / 100;
    console.log(
      `Processing paypal payment of $${amount} with a fee of $${feeAmount}`
    );
  },
};
