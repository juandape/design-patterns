export interface User {
  name: string;
  send(message: string): void;
  receive(message: string, from: string): void;
}