export const generateAuthToken = (): string => {
  const token = Math.random().toString(36).substr(2);
  return token;
};