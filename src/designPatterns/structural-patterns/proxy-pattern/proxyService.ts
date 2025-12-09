import { UserService } from "./apiService";
import { IUserService } from "./userService.type";

export class UserProxyService implements IUserService {
  private readonly realService: UserService
  private readonly cache: Map<number, string> = new Map();

  constructor() {
    this.realService = new UserService();
  }

  async getUser(id: string): Promise<string> {
    if (this.cache.has(Number(id))) {
      console.log('Returning cached data...');
      return this.cache.get(Number(id))!;
    }

    const userData = await this.realService.getUser(id);
    this.cache.set(Number(id), userData);
    return userData;
  }
}