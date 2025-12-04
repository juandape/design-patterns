import { AbstractFactoryComponent } from '../src/components/creational-patterns/abstract-factory-pattern/abstractFactory';
import { AuthTest } from '../src/components/creational-patterns/singleton-pattern/authTest';
import { ThemeProvider } from '../src/components/creational-patterns/abstract-factory-pattern/ThemeContext/themeContext';
import { Checkout } from '../src/components/react-patterns/strategy-pattern/payment-method/Checkout';
import { NotificationObserverOne } from '../src/components/behaviorals-patterns/observer-pattern/NotificationObserverOne';
import { NotificationSender } from '../src/components/behaviorals-patterns/observer-pattern/NotificationSender';
import { NotificationObserverTwo } from '../src/components/behaviorals-patterns/observer-pattern/NotificationObserverTwo';
import { CommandPattern } from '../src/components/behaviorals-patterns/command-pattern/commandPattern';
import { PasswordValidator } from '../src/components/behaviorals-patterns/chainOfResponsability-pattern/PasswordValidator';
import { OrderTracker } from '@/src/components/behaviorals-patterns/state-pattern/OrderTracker';
import { ReportGenerator } from '@/src/components/behaviorals-patterns/templateMethod-pattern/ReportGenerator';
import { MusicPlayer } from '@/src/components/behaviorals-patterns/iterator-pattern/MusicPlayer';
import { ChatRoomComponent } from '@/src/components/behaviorals-patterns/mediator-pattern/ChatRoomComponent';

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
      <OrderTracker />
      <ReportGenerator />
      <MusicPlayer />
      <ChatRoomComponent />
    </ThemeProvider>
  );
}
