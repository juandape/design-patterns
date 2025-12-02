import { AuthService } from "../AuthService/authService";

export const simulateLogin = () => {
  const auth = AuthService.getInstance();
  auth.setToken("my-secret-token", 3600);
}

export const simulateRequest = () => {
  const auth = AuthService.getInstance();
  console.log("sending request with token:", auth.getToken());
}

simulateLogin();
simulateRequest();