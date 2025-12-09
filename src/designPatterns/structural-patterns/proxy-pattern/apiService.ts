import { IUserService } from './userService.type';

export class UserService implements IUserService {
  async getUser(id: string): Promise<string> {
    console.log('Calling API...');
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call delay
    return `User data for ${id}`;
  }
}
