import { Checkout } from '@/src/designPatterns/react-patterns/strategy-pattern/payment-method/Checkout';

export default function Home() {
  return (
    <div className='p-5 mt-5 w-1/2 bg-white text-black mx-auto'>
      <h1>Strategy Pattern Example</h1>
      <Checkout />
    </div>
  );
}
