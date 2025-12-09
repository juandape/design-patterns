import { INotificationService } from "../types/notification.type";

export class BaseNotificationDecorator implements INotificationService {
  constructor(protected service: INotificationService) { }

  send(message: string): string {
    return this.service.send(message);
  }
}