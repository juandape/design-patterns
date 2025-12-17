export const validateEmail = (email: string) => {
  return email.includes('@');
};

export const validatePassword = (password: string) => {
  return password.length >= 8;
};
