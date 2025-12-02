export interface IUserService {
  getUser(id: string): Promise<string>;
}