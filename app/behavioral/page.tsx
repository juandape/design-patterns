import { PasswordValidator } from "@/src/designPatterns/behaviorals-patterns/chainOfResponsability-pattern/PasswordValidator";
import { CommandPattern } from "@/src/designPatterns/behaviorals-patterns/command-pattern/commandPattern";
import { MusicPlayer } from "@/src/designPatterns/behaviorals-patterns/iterator-pattern/MusicPlayer";
import { ChatRoomComponent } from "@/src/designPatterns/behaviorals-patterns/mediator-pattern/ChatRoomComponent";
import { NotificationObserverOne } from "@/src/designPatterns/behaviorals-patterns/observer-pattern/NotificationObserverOne";
import { NotificationObserverTwo } from "@/src/designPatterns/behaviorals-patterns/observer-pattern/NotificationObserverTwo";
import { NotificationSender } from "@/src/designPatterns/behaviorals-patterns/observer-pattern/NotificationSender";
import { OrderTracker } from "@/src/designPatterns/behaviorals-patterns/state-pattern/OrderTracker";
import { ReportGenerator } from "@/src/designPatterns/behaviorals-patterns/templateMethod-pattern/ReportGenerator";

export default function BehavioralsPage() {
  return (
    <div className='p-5 mt-5 w-1/2 bg-white text-black mx-auto'>
      <h1>Behavioral Patterns</h1>
      <div className='mt-5 border p-5'>
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
    </div>
  );
}