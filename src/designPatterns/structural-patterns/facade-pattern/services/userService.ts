import { User } from '../types/user.type';

export class UserService {
  createUser({ name, email }: User): string {
    return `User ${name} with email ${email} created successfully.`;
  }
}
