import { User } from './types/user.type';

export class ChatRoom {
  private readonly users: User[] = [];

  register(user: User): void {
    this.users.push(user);
  }

  sendMessage(message: string, from: User): void {
    for (const user of this.users) {
      if (user.name !== from.name) {
        user.receive(message, from.name);
      }
    }
  }
}
