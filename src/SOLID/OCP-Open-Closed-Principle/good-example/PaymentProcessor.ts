import { IPaymentProcessor } from './PaymentMethod';

export const processPayment = (
  paymentMethod: IPaymentProcessor,
  amount: number,
  data: unknown
) => {
  if (!paymentMethod.validate(data)) {
    throw new Error(`Validation failed for ${paymentMethod.name}`);
  }

  paymentMethod.process(amount);

  return `Payment of $${amount} processed successfully using ${paymentMethod.name}`;
};
