import { AbstractFactoryComponent } from '../src/designPatterns/creational-patterns/abstract-factory-pattern/abstractFactory';
import { AuthTest } from '../src/designPatterns/creational-patterns/singleton-pattern/authTest';
import { ThemeProvider } from '../src/designPatterns/creational-patterns/abstract-factory-pattern/ThemeContext/themeContext';
import { Checkout } from '../src/designPatterns/react-patterns/strategy-pattern/payment-method/Checkout';
import { NotificationObserverOne } from '../src/designPatterns/behaviorals-patterns/observer-pattern/NotificationObserverOne';
import { NotificationSender } from '../src/designPatterns/behaviorals-patterns/observer-pattern/NotificationSender';
import { NotificationObserverTwo } from '../src/designPatterns/behaviorals-patterns/observer-pattern/NotificationObserverTwo';
import { CommandPattern } from '../src/designPatterns/behaviorals-patterns/command-pattern/commandPattern';
import { PasswordValidator } from '../src/designPatterns/behaviorals-patterns/chainOfResponsability-pattern/PasswordValidator';
import { OrderTracker } from '@/src/designPatterns/behaviorals-patterns/state-pattern/OrderTracker';
import { ReportGenerator } from '@/src/designPatterns/behaviorals-patterns/templateMethod-pattern/ReportGenerator';
import { MusicPlayer } from '@/src/designPatterns/behaviorals-patterns/iterator-pattern/MusicPlayer';
import { ChatRoomComponent } from '@/src/designPatterns/behaviorals-patterns/mediator-pattern/ChatRoomComponent';
import { ChatBot } from '@/src/mastra/ChatBot/ChatBot';
import { AddTasks } from '@/src/redux/components/AddTasks';
import { TasksList } from '@/src/redux/components/TasksList';
import { FetchTasks } from '@/src/redux/components/FetchTasks';

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
      <ChatBot />
      <div className='p-5 mt-5 w-96 bg-white text-black'>
        <h1>Redux Toolkit Example Tasks</h1>
        <AddTasks />
        <FetchTasks />
        <TasksList />
      </div>
    </ThemeProvider>
  );
}
