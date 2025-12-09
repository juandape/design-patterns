export interface PasswordStrategy {
  validate(password: string): boolean;
  message: string;
}