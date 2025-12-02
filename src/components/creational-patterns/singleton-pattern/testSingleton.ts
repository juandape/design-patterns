import { AuthService } from "./components/AuthService/authService";

const auth1 = AuthService.getInstance();
const auth2 = AuthService.getInstance();

auth1.setToken("abc123", 3);

console.log("Auth1 Token:", auth1.getToken());
console.log("Auth2 Token:", auth2.getToken());

console.log("Misma instancia? ", auth1 === auth2);


setTimeout(() => {
  console.log("Auth1 Token after expiration:", auth1.getToken());
  console.log("Auth2 Token after expiration:", auth2.getToken());
}, 4000);