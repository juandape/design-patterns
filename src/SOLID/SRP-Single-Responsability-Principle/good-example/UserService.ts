import { generateAuthToken } from './AuthService';
import { sendWelcomeEmail } from './EmailService';
import { generateUserReport } from './ReportGenerator';
import { saveUser, UserData } from './UserRepository';
import { validateEmail, validatePassword } from './UserValidator';

export const createUser = (userData: UserData): string => {
  if (!validateEmail(userData.email)) {
    throw new Error('Invalid email address');
  }

  if (!validatePassword(userData.password)) {
    throw new Error('Invalid password');
  }

  saveUser(userData);

  const token = generateAuthToken();

  sendWelcomeEmail(userData.email);

  generateUserReport(userData);

  const result = 'user created successfully';

  return `${result} with token: ${token}`;
};
