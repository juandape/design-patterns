import { IPaymentProcessor } from './PaymentMethod';

export const CryptoPayment: IPaymentProcessor = {
  name: 'crypto',
  fee: 1,
  validate(data: unknown): boolean {
    const cardData = data as { walletAddress: string };
    if (!cardData || cardData.walletAddress) console.log('please verify your wallet address');
    return true;
  },
  process(amount: number): void {
    const feeAmount = (amount * this.fee) / 100;
    console.log(
      `Processing crypto payment of $${amount} with a fee of $${feeAmount}`
    );
  },
};
