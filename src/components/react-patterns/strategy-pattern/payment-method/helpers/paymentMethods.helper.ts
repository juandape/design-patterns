import {
  BankTransferPayment,
  BitcoinPayment,
  CreditCardPayment,
  DebitCardPayment,
  PayPalPayment,
} from '../components/strategies/paymentStratregies';

export const credit = new CreditCardPayment('Visa', true);
export const debit = new DebitCardPayment('MasterCard', true);
export const paypal = new PayPalPayment('user@example.com', true);
export const bitcoin = new BitcoinPayment(
  '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  true
);
export const bankTransfer = new BankTransferPayment('123456789', true);
