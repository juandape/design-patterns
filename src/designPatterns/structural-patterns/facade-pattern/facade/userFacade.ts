import { EmailService } from '../services/emailService';
import { LoggerService } from '../services/loggerService';
import { UserService } from '../services/userService';
import { User, Email } from '../types/user.type';

export class UserFacade {
  private readonly userService: UserService;
  private readonly emailService: EmailService;
  private readonly loggerService: LoggerService;

  constructor() {
    this.userService = new UserService();
    this.emailService = new EmailService();
    this.loggerService = new LoggerService();
  }

  registerUser(user: User, email: Email): string {
    const userCreationMessage = this.userService.createUser(user);
    const emailMessage = this.emailService.sendEmail(email);
    const logMessage = this.loggerService.logMessage({
      message: 'User registered successfully',
    });

    return `${userCreationMessage}\n${emailMessage}\n${logMessage}`;
  }
}
