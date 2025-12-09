import { Notifier } from "./notifier";

export class AlertNotifier extends Notifier {
  notify(message: string): void {
    this.channel.sendNotification(`Alert: ${message}`);
  }
}