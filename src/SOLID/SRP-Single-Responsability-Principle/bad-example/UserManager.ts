interface UserData {
  email: string;
  password: string;
  name: string;
}

export const createUser = (userData: UserData) => {
  if (!userData.email.includes('@')) {
    console.log('Invalid email');
  }

  if (userData.password.length < 8) {
    console.log('Password must be at least 8 characters long');
  }

  if (userData.email && userData.password) {
    console.log('User created successfully');
  } else {
    throw new Error('Invalid user data');
  }

  const token = Math.random().toString(36).substring(2);

  const sentEmail = console.log(`welcome email sent to ${userData.name}`);

  const successReport = console.log(
    `user ${userData.email}, ${userData.name}, ${userData.password} created successfully`
  );

  return {
    token,
    successReport,
    sentEmail,
  };
};
