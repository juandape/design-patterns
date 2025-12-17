import { UserData } from './UserRepository';

export const generateUserReport = (userData: UserData): void => {
  console.log(`User Report:
  Name: ${userData.name}
  Email: ${userData.email}
  `);
};
