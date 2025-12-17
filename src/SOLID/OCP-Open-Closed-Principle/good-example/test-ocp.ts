import { processPayment } from './PaymentProcessor';
import { CreditCardPayment } from './CreditCardPayment';
import { ApplePayPayment } from './ApplePayPayment';
import { PayPalPayment } from './PaypalPayment';
import { CryptoPayment } from './CryptoPayment';

try {
  const result = processPayment(CreditCardPayment, 100, {
    cardNumber: '1234-5678-9012-3456',
    expiryDate: '12/25',
    cvv: '123',
  });

  console.log(result);
} catch {
  console.log('Payment with Credit Card processing failed');
}

try {
  const result = processPayment(ApplePayPayment, 100, {
    appleId: 'user@apple.com',
    deviceAccountNumber: '1234567890',
  });

  console.log(result);
} catch {
  console.log('Payment with Apple Pay processing failed');
}

try {
  const result = processPayment(PayPalPayment, 100, {
    email: 'user@paypal.com',
    password: 'securepassword',
  });

  console.log(result);
} catch {
  console.log('Payment with PayPal processing failed');
}

try {
  const result = processPayment(CryptoPayment, 100, {
    walletAddress: '0x123456789abcdef',
    amount: 100,
  });

  console.log(result);
} catch {
  console.log('Payment with Crypto processing failed');
}
