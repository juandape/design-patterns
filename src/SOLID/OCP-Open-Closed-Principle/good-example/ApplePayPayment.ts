import { IPaymentProcessor } from './PaymentMethod';

export const ApplePayPayment: IPaymentProcessor = {
  name: 'apple-pay',
  fee: 2.5,
  validate(data: unknown): boolean {
    const cardData = data as { appleId: string };
    if (!cardData || !cardData.appleId) console.log('please verify your Apple ID');
    return true;
  },
  process(amount: number): void {
    const feeAmount = (amount * this.fee) / 100;
    console.log(
      `Processing apple pay payment of $${amount} with a fee of $${feeAmount}`
    );
  },
};
