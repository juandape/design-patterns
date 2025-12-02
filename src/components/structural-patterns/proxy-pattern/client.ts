import { UserProxyService } from "./proxyService";

export const proxyPattern = async () => {
  const userService = new UserProxyService();

  const user1 = await userService.getUser("1");
  console.log(user1); // Fetches from real service

  const user2 = await userService.getUser("2");
  console.log(user2); // Fetches from real service

  const user1Cached = await userService.getUser("1");
  console.log(user1Cached); // Returns cached data

  const user2Cached = await userService.getUser("2");
  console.log(user2Cached); // Returns cached data
}

proxyPattern();