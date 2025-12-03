import { AbstractFactoryComponent } from '../src/components/creational-patterns/abstract-factory-pattern/abstractFactory';
import { AuthTest } from '../src/components/creational-patterns/singleton-pattern/authTest';
import { ThemeProvider } from '../src/components/creational-patterns/abstract-factory-pattern/ThemeContext/themeContext';
import { Checkout } from '../src/components/react-patterns/strategy-pattern/payment-method/Checkout';
import { NotificationObserverOne } from '../src/components/behaviorals-patterns/observer-pattern/NotificationObserverOne';
import { NotificationSender } from '../src/components/behaviorals-patterns/observer-pattern/NotificationSender';
import { NotificationObserverTwo } from '../src/components/behaviorals-patterns/observer-pattern/NotificationObserverTwo';
import { CommandPattern } from '../src/components/behaviorals-patterns/command-pattern/commandPattern';
import { PasswordValidator } from '../src/components/behaviorals-patterns/chainOfResponsability-pattern/PasswordValidator';

export default function Home() {
  return (
    <ThemeProvider>
      <div className='mx-auto my-auto'>
        <AuthTest />
        <AbstractFactoryComponent />
      </div>
      <Checkout />
      <div className='mt-5 border w-96 ml-5 p-5 bg-blue-900'>
        <NotificationSender />
        <NotificationObserverOne />
        <NotificationObserverTwo />
      </div>
      <CommandPattern />
      <PasswordValidator />
    </ThemeProvider>
  );
}
