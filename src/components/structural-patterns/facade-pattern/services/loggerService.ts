import { Logger } from "../types/user.type";

export class LoggerService {
  logMessage({ message }: Logger): string {
    return `Log -> ${message}`;
  }
}