import { AbstractFactoryComponent } from '../components/creational-patterns/abstract-factory-pattern/abstractFactory';
import { AuthTest } from '../components/creational-patterns/singleton-pattern/authTest';
import { ThemeProvider } from '../components/creational-patterns/abstract-factory-pattern/ThemeContext/themeContext';
import { Checkout } from '../components/react-patterns/strategy-pattern/payment-method/Checkout';

export default function Home() {
  return (
    <ThemeProvider>
    <div className='mx-auto my-auto'>
      <AuthTest />
      <AbstractFactoryComponent />
      </div>
      <Checkout />
    </ThemeProvider>
  );
}
