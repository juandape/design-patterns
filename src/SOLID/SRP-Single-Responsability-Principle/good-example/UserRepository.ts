export interface UserData {
  email: string;
  password: string;
  name: string;
}

export const saveUser = (userData: UserData): void => {
  if (userData) {
    // Logic to save the user data to a database or storage
    console.log(`User ${userData.name} saved successfully.`);
  } else {
    throw new Error('Invalid user data');
  }
};
