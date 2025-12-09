import { PasswordStrategy } from '../../types/passwordStrategy.type';

export class PasswordValidator {
  constructor(private readonly strategies: PasswordStrategy[]) {}

  validate(password: string) {
    return this.strategies.map((strategy) => ({
      valid: strategy.validate(password),
      message: strategy.message,
    }));
  }
}
