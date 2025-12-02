import { Notifier } from "./notifier";

export class BasicNotifier extends Notifier {
  notify(message: string): void {
    this.channel.sendNotification(`Basic: ${message}`);
  }
}