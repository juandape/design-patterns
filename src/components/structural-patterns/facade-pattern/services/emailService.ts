import { Email } from '../types/user.type';

export class EmailService {
  sendEmail({ email, message }: Email): string {
    return `Email sent to ${email} with message: ${message}`;
  }
}
