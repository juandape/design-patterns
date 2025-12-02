import { PasswordStrategy } from '../../types/passwordStrategy.type';

export class MinLengthStrategy implements PasswordStrategy {
  constructor(private readonly minLength: number) {}
  message: string = `Password must be at least ${this.minLength} characters long`;

  validate(password: string): boolean {
    return password.length >= this.minLength;
  }
}

export class NumberStrategy implements PasswordStrategy {
  message: string = 'Password must contain at least one number';

  validate(password: string): boolean {
    return /\d/.test(password);
  }
}

export class UppercaseStrategy implements PasswordStrategy {
  message: string = 'Password must contain at least one uppercase letter';

  validate(password: string): boolean {
    return /[A-Z]/.test(password);
  }
}

export class SpecialCharacterStrategy implements PasswordStrategy {
  message: string = 'Password must contain at least one special character';

  validate(password: string): boolean {
    return /[!@#$%^&*(),.?":{}|<>]/.test(password);
  }
}
