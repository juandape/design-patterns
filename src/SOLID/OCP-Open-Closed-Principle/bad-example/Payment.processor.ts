type PaymentMethod = 'credit-card' | 'paypal' | 'crypto' | 'apple-pay';

export const ProcessPayment = (amount: number, method: PaymentMethod) => {
  if (method === 'credit-card') {
    const fee = (amount * 2) / 100;
    console.log('please verify your CVV number');
    return console.log(
      `Processing credit card payment of $${amount} with a fee of $${fee}`
    );
  } else if (method === 'paypal') {
    const fee = (amount * 3) / 100;
    console.log('Please validate email address');
    return console.log(
      `Processing PayPal payment of $${amount} with a fee of $${fee}`
    );
  } else if (method === 'crypto') {
    const fee = (amount * 1) / 100;
    console.log('Please confirm your wallet address');
    return console.log(
      `Processing crypto payment of $${amount} with a fee of $${fee}`
    );
  } else if (method === 'apple-pay') {
    const fee = (amount * 2.5) / 100;
    console.log('Please authenticate with Face ID or Touch ID');
    return console.log(
      `Processing Apple Pay payment of $${amount} with a fee of $${fee}`
    );
  } else if (!method) return 'No method provided or invalid method';
};
