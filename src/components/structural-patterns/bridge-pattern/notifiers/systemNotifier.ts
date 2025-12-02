import { Notifier } from "./notifier";

export class SystemNotifier extends Notifier {
  notify(message: string): void {
    this.channel.sendNotification(`System: ${message}`);
  }
}