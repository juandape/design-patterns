import { ChatRoom } from './chatRoom';
import { User } from './types/user.type';

export class ChatUser implements User {
  name: string;
  private readonly chatRoom: ChatRoom;
  private readonly onMessageReceived?: (message: string, from: string) => void;

  constructor(
    name: string,
    chatRoom: ChatRoom,
    onMessageReceived?: (message: string, from: string) => void
  ) {
    this.name = name;
    this.chatRoom = chatRoom;
    this.onMessageReceived = onMessageReceived;
  }

  send(message: string): void {
    this.chatRoom.sendMessage(message, this);
  }

  receive(message: string, from: string): void {
    if (this.onMessageReceived) {
      this.onMessageReceived(message, from);
    }
  }
}
